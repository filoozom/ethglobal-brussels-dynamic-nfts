// NOTE: Would rather use https://deno.land/x/skia_canvas@0.5.6,
// but that requires FFI, which is not supported by Chainlink.
const { createCanvas } = await import("https://deno.land/x/canvas/mod.ts");
const { CID } = await import("npm:multiformats/cid");
const { sha256 } = await import("npm:multiformats/hashes/sha2");
const { encode, code } = await import("npm:multiformats/codecs/raw");
const { generateImage, getImageConfig, generateMetadata } = await import(
  "https://cdn.gisthostfor.me/filoozom-tbPpmAb40f-generate.js"
);

// Args
const tokenId = parseInt(bytesArgs[0]);
let seed = parseInt(bytesArgs[1]);

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

// Raw encode the canvas bytes
const config = getImageConfig();
const canvas = generateImage(
  createCanvas(config.width, config.height),
  newRNG(seed),
  args,
  bytesArgs
);
const bytes = encode(canvas.toBuffer("image/png"));

// Calculate the image CID
const imageHash = await sha256.digest(bytes);
const imageCID = CID.create(1, code, imageHash);

// Create the metadata
const metadata = generateMetadata(newRNG(seed), args, bytesArgs);
metadata.image = "ipfs://" + imageCID.toString();

// Calculate the metadata CID
const text = new TextEncoder().encode(JSON.stringify(metadata));
const metadataHash = await sha256.digest(text);
const metadataCID = CID.create(1, code, metadataHash);

// Return CID as ABI encoded string
return Functions.encodeString(metadataCID.toString());
