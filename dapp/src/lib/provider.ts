import { Contract, getDefaultProvider } from "ethers";

export const chainId = 421614;
export const rpc =
  "https://arb-sepolia.g.alchemy.com/v2/GPR_qF9l_vj-iDb1Kdg3cjDBB-ktJ7Lt";
export const explorer = "https://sepolia-explorer.arbitrum.io";
export const openSea = "https://testnets.opensea.io/assets/arbitrum-sepolia";

export const chainSpec = {
  chainId,
  chainName: "Arbitrum Sepolia",
  rpcUrls: [rpc],
  blockExplorerUrls: [explorer],
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const provider = getDefaultProvider(rpc);

export const nftAddress = "0x9640D28e20445CCcEd345FF0ab20560AD067f9a1";
export const nftContract = new Contract(
  nftAddress,
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
    {
      inputs: [],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  provider
);
