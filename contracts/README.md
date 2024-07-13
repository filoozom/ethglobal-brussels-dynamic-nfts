# Contracts

## Deployment

1) Create a Chainlink Functions subscription [here](https://functions.chain.link/arbitrum-sepolia/new)
2) Copy `.env.sample` to `.env`
3) Add your private key and Etherscan key to `.env`
4) Run `./deploy.sh`
5) Add the deployed contract address as `GENERATIVE_NFT` to `.env` (used for `mint.sh` and `update-source.sh` if necessary)
6) Add the deployed contract address as a consumer in your Chainlink subscription
7) Fund the Chainlink subscription
