// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// Chainlink
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

// Solmate
import {ERC721} from "solmate/tokens/ERC721.sol";

contract GenerativeNFT is FunctionsClient, ConfirmedOwner, ERC721 {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink
    uint32 private constant GAS_LIMIT = 50_000;
    uint64 private subscriptionId;
    bytes32 private immutable donID;
    string public source;
    string public script;

    // IPFS
    mapping(uint256 => string) private tokenHashes;
    mapping(bytes32 => uint256) private requestIds;

    // NFT
    uint256 private currentTokenId;

    // Errors
    error NotFound();
    error PendingTokenUri();

    // Events
    event TokenRendered(uint256 indexed tokenId, string hash);

    // NOTE: Would love for Chainlink to support ipfs:// sources, so that
    // one could build a fully contained script and push it on IPFS instead
    // of having to push the full source code on chain to be fully decentralized
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _source,
        string memory _script,
        address _router,
        uint64 _subscriptionId,
        bytes32 _donID
    )
        FunctionsClient(_router)
        ConfirmedOwner(msg.sender)
        ERC721(_name, _symbol)
    {
        source = _source;
        script = _script;
        subscriptionId = _subscriptionId;
        donID = _donID;
    }

    // TODO: Inline source with a script that fetches all the rest from IPFS and retries
    // with many IPFS nodes (including a list sent over in args) in order to remain robust
    function sendRequest(uint256 tokenId) private {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Remote,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );

        // Bytes args
        bytes[] memory bytesArgs = new bytes[](2);
        bytesArgs[0] = abi.encodePacked(tokenId);
        bytesArgs[1] = abi.encodePacked(block.timestamp);
        req.setBytesArgs(bytesArgs);

        // Args
        string[] memory args = new string[](1);
        args[0] = source;
        req.setArgs(args);

        // Send the request
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            GAS_LIMIT,
            donID
        );

        // Link the request ID to the token ID
        requestIds[requestId] = tokenId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory /* err */
    ) internal override {
        uint256 tokenId = requestIds[requestId];

        // TODO: Handle err

        string memory hash = string(response);
        tokenHashes[tokenId] = hash;
        emit TokenRendered(tokenId, hash);
    }

    function mint() public {
        uint256 tokenId = ++currentTokenId;
        _safeMint(msg.sender, tokenId);
        sendRequest(tokenId);
    }

    function tokenURI(
        uint256 id
    ) public view virtual override returns (string memory) {
        if (ownerOf(id) == address(0)) {
            revert NotFound();
        }

        string memory tokenHash = tokenHashes[id];

        if (bytes(tokenHash).length == 0) {
            revert PendingTokenUri();
        }

        return string(abi.encodePacked("ipfs://", tokenHash));
    }

    function setSource(string calldata _source) public onlyOwner {
        source = _source;
    }

    function setScript(string calldata _script) public onlyOwner {
        script = _script;
    }
}
