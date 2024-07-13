source .env

# TODO: Minify the function first
cp ../functions/function.js assets/function.js

forge script \
    --chain $CHAIN \
    script/GenerativeNFT.s.sol:GenerativeNFTScript \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv
