source .env

# TODO: Minify the function first
cp ../functions/function.js assets/function.js

forge script \
    --chain $CHAIN \
    script/UpdateSource.s.sol:UpdateSourceScript \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --skip-simulation \
    -vvvv