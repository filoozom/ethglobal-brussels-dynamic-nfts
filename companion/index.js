import { getDefaultProvider, Contract } from "npm:ethers";
import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
import { CID } from "npm:multiformats/cid";
import { sha256 } from "npm:multiformats/hashes/sha2";
import {
  encode as rawEncode,
  code as rawCode,
} from "npm:multiformats/codecs/raw";

// Generation script
const { generateImage, getImageConfig, generateMetadata } = await import(
  "https://cdn.gisthostfor.me/filoozom-tbPpmAb40f-generate.js"
);

const provider = getDefaultProvider(Deno.env.get("RPC_URL"));
const contract = new Contract(
  Deno.env.get("GENERATIVE_NFT"),
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "seed",
          type: "uint256",
        },
      ],
      name: "RenderingToken",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "seed",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "hash",
          type: "string",
        },
      ],
      name: "TokenRendered",
      type: "event",
    },
  ],
  provider
);

const newRNG = (seed) => (min, max) => {
  seed |= 0;
  seed = (seed + 0x9e3779b9) | 0;

  let temp = seed ^ (seed >>> 16);
  temp = Math.imul(temp, 0x21f0aaad);
  temp = temp ^ (temp >>> 15);
  temp = Math.imul(temp, 0x735a2d97);

  if (!max) {
    max = min;
    min = 0;
  }

  const value = ((temp = temp ^ (temp >>> 15)) >>> 0) / 4294967296;
  return Math.floor(value * (max - min + 1) + min);
};

// NOTE: Has to be done manually because the Lighthouse SDK doesn't work in Deno
const uploadToLighthouse = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob);

  const response = await fetch("https://node.lighthouse.storage/api/v0/add", {
    method: "POST",
    body: formData,
    headers: {
      "Mime-Type": "image/png",
      Authorization: "Bearer " + Deno.env.get("LIGHTHOUSE_KEY"),
    },
  });

  return await response.json();
};

const renderToken = async (tokenId, seed, hash) => {
  console.log(
    `Rendering token ${tokenId} with seed ${seed}${
      hash ? ` and expected hash ${hash}` : ""
    }`
  );

  // Convert seed to number
  seed = Number(seed);

  // Arguments
  const args = [];
  const bytesArgs = [tokenId, seed];

  // Generate image
  const config = getImageConfig();
  const canvas = generateImage(
    createCanvas(config.width, config.height),
    newRNG(seed),
    args,
    bytesArgs
  );

  // Render image
  const buffer = canvas.toBuffer("image/png");
  const bytes = rawEncode(buffer);
  const blob = new Blob([buffer], { type: "image/png" });

  // Calculate CID
  const imageHash = await sha256.digest(bytes);
  const imageCID = CID.create(1, rawCode, imageHash);

  // Create the metadata
  const metadata = generateMetadata(newRNG(seed), args, bytesArgs);
  metadata.image = "ipfs://" + imageCID.toString();

  // Calculate the metadata CID
  const metadataString = JSON.stringify(metadata);
  const text = rawEncode(new TextEncoder().encode(metadataString));
  const metadataHash = await sha256.digest(text);
  const metadataCID = CID.create(1, rawCode, metadataHash);

  // Compare hash
  if (hash && hash !== metadataCID.toString()) {
    console.error("CIDs not match:", {
      tokenId,
      seed,
      expected: hash,
      actual: metadataCID,
    });
    // return;
  }

  // Upload image if they match or there's no hash
  const { Hash: uploadedImageHash } = await uploadToLighthouse(blob);
  if (uploadedImageHash !== imageCID.toString()) {
    console.error("Image CIDs do not match in Lighthouse upload:", {
      tokenId,
      seed,
      expected: metadataCID.toString(),
      actual: uploadedImageHash,
    });
  }

  // Upload image if they match or there's no hash
  const { Hash: uploadedMetadataHash } = await uploadToLighthouse(
    new Blob([metadataString], { type: "application/json" })
  );
  if (uploadedMetadataHash !== metadataCID.toString()) {
    console.error("Image CIDs do not match in Lighthouse upload:", {
      tokenId,
      seed,
      contract: hash,
      expected: metadataCID.toString(),
      actual: uploadedMetadataHash,
    });
  }
};

// Listen to new events
contract.on("RenderingToken", async (tokenId, seed) => {
  await renderToken(tokenId, seed);
});

contract.on("TokenRendered", async (tokenId, seed, hash) => {
  await renderToken(tokenId, seed, hash);
});

// Fetch previous events
const events = await contract.queryFilter("TokenRendered", -50_000);
for (const { args } of events) {
  await renderToken(args[0], args[1], args[2]);
}
