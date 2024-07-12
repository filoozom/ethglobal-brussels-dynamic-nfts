source .env

forge script \
    --chain $CHAIN \
    script/MintNFT.s.sol:MintNFTScript \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv
    