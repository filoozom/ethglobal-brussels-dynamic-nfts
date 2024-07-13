import { derived, readable } from "svelte/store";

// Lib
import { nftContract } from "../lib/provider";

// Types
type NFT = {
  tokenId: bigint;
  seed: bigint;
  hash?: string;
};

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

  nftContract.on("TokenRendered", renderedListener);
  nftContract.on("RenderingToken", renderingListener);

  // Fetch previous events
  (async () => {
    const events = await nftContract.queryFilter("TokenRendered");
    const previous = events.map(({ args }: any) => ({
      tokenId: args[0],
      seed: args[1],
      hash: args[2],
    }));
    addNfts(...previous);
  })();

  return () => {
    nftContract.off("TokenRendered", renderedListener);
    nftContract.off("RenderingToken", renderingListener);
  };
});

export const nfts = derived(nftMap, ($nftMap) => {
  return Object.values($nftMap).sort((a, b) => Number(a.tokenId - b.tokenId));
});
