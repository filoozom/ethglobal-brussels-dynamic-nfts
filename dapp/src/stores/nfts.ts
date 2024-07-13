import { derived, readable } from "svelte/store";
import { type Log } from "ethers";

// Lib
import { nftContract } from "../lib/provider";

// Types
type NFT = {
  tokenId: bigint;
  seed: bigint;
  transactionHash?: string;
  hash?: string;
  chainlinkTransactionHash?: string;
};

export const nftMap = readable<Record<string, NFT>>({}, (_, update) => {
  const addNfts = (...add: (Partial<NFT> & { tokenId: bigint })[]) => {
    update((nfts) => {
      const copy = { ...nfts };
      for (const nft of add) {
        const key = nft.tokenId.toString();
        copy[key] = { ...(copy[key] || {}), ...nft };
      }
      return copy;
    });
  };

  const renderedListener = async (
    tokenId: bigint,
    seed: bigint,
    hash: string,
    { transactionHash }: Log
  ) => {
    addNfts({ tokenId, seed, hash, chainlinkTransactionHash: transactionHash });
  };

  const renderingListener = async (
    tokenId: bigint,
    seed: bigint,
    { transactionHash }: Log
  ) => {
    addNfts({ tokenId, seed, transactionHash });
  };

  nftContract.on("TokenRendered", renderedListener);
  nftContract.on("RenderingToken", renderingListener);

  // Fetch previous events
  (async () => {
    const events = await nftContract.queryFilter("TokenRendered");
    const previous = events.map(({ args, transactionHash }: any) => ({
      tokenId: args[0],
      seed: args[1],
      hash: args[2],
      chainlinkTransactionHash: transactionHash,
    }));
    addNfts(...previous);
  })();

  // Fetch previous events
  (async () => {
    const events = await nftContract.queryFilter("RenderingToken");
    const previous = events.map(({ args, transactionHash }: any) => ({
      tokenId: args[0],
      seed: args[1],
      transactionHash,
    }));
    addNfts(...previous);
  })();

  return () => {
    nftContract.off("TokenRendered", renderedListener);
    nftContract.off("RenderingToken", renderingListener);
  };
});

export const nfts = derived(nftMap, ($nftMap) => {
  return Object.values($nftMap).sort((a, b) => Number(b.tokenId - a.tokenId));
});
