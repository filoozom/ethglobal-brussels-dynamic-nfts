import { derived, readable } from "svelte/store";
import { Contract } from "ethers";

// Lib
import { provider } from "../lib/provider";

// Types
type NFT = {
  tokenId: bigint;
  seed: bigint;
  hash?: string;
};

// Contract
const contract = new Contract(
  "0xcbeeA39747FdEd002e02641dE595f1457d353787",
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

export const nftMap = readable<Record<string, NFT>>({}, (_, update) => {
  const addNfts = (...add: NFT[]) => {
    update((nfts) => {
      const copy = { ...nfts };
      for (const nft of add) {
        if (!copy[nft.tokenId.toString()]?.hash) {
          copy[nft.tokenId.toString()] = nft;
        }
      }
      return copy;
    });
  };

  const renderedListener = async (
    tokenId: bigint,
    seed: bigint,
    hash: string
  ) => {
    addNfts({ tokenId, seed, hash });
  };

  const renderingListener = async (tokenId: bigint, seed: bigint) => {
    addNfts({ tokenId, seed });
  };

  contract.on("TokenRendered", renderedListener);
  contract.on("RenderingToken", renderingListener);

  // Fetch previous events
  (async () => {
    const events = await contract.queryFilter("TokenRendered");
    const previous = events.map(({ args }: any) => ({
      tokenId: args[0],
      seed: args[1],
      hash: args[2],
    }));
    addNfts(...previous);
  })();

  return () => {
    contract.off("TokenRendered", renderedListener);
    contract.off("RenderingToken", renderingListener);
  };
});

export const nfts = derived(nftMap, ($nftMap) => {
  return Object.values($nftMap).sort((a, b) => Number(a.tokenId - b.tokenId));
});
