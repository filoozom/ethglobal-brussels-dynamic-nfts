import { Contract, getDefaultProvider } from "ethers";

export const chainId = 421614;
export const rpc =
  "https://arb-sepolia.g.alchemy.com/v2/GPR_qF9l_vj-iDb1Kdg3cjDBB-ktJ7Lt";
export const explorer = "https://sepolia-explorer.arbitrum.io";

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

export const nftAddress = "0x33A19605B4A4b7F141C998bf293A35805Ec9F728";
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
