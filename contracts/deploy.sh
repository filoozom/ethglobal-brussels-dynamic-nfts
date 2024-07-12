source .env

forge script \
    --chain $CHAIN \
    script/GenerativeNFT.s.sol:GenerativeNFTScript \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv
