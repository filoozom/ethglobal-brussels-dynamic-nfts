// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {GenerativeNFT} from "../src/GenerativeNFT.sol";

contract UpdateSourceScript is Script {
    GenerativeNFT public nft;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nftAddress = vm.envAddress("GENERATIVE_NFT");
        string memory source = vm.readFile("assets/function.js");

        vm.startBroadcast(deployerPrivateKey);

        nft = GenerativeNFT(nftAddress);
        nft.setSource(source);

        vm.stopBroadcast();
    }
}
