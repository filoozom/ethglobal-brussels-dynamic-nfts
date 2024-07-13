import { Contract, getDefaultProvider } from "ethers";

export const chainId = 11155111;
export const rpc =
  "https://eth-sepolia.g.alchemy.com/v2/GPR_qF9l_vj-iDb1Kdg3cjDBB-ktJ7Lt";
export const explorer = "https://eth-sepolia.blockscout.com/";

export const chainSpec = {
  chainId,
  chainName: "Sepolia",
  rpcUrls: [rpc],
  blockExplorerUrls: [explorer],
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const provider = getDefaultProvider(rpc);

export const nftAddress = "0xcbeeA39747FdEd002e02641dE595f1457d353787";
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
