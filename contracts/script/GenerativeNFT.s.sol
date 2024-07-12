// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {GenerativeNFT} from "../src/GenerativeNFT.sol";

contract GenerativeNFTScript is Script {
    GenerativeNFT public nft;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address router = vm.envAddress("ROUTER");
        uint64 subscriptionId = uint64(vm.envUint("SUBSCRIPTION_ID"));
        bytes32 domId = vm.envBytes32("DOM_ID");

        vm.startBroadcast(deployerPrivateKey);

        nft = new GenerativeNFT(
            "Generative NFT",
            "GNFT",
            "https://cdn.jsdelivr.net/gh/filoozom/ethglobal-brussels-dynamic-nfts@main/functions/function.js",
            "https://cdn.gisthostfor.me/filoozom-4XDZ64lBpn-generate.js",
            router,
            subscriptionId,
            domId
        );

        vm.stopBroadcast();
    }
}
