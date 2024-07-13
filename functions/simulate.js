import { readFile } from "fs/promises";
import { solidityPacked, getBytes } from "ethers";
import {
  ReturnType,
  simulateScript,
  decodeResult,
} from "@chainlink/functions-toolkit";

const tokenId = 4;
const seed = 1720869576;

const source = await readFile("function.js", "utf-8");
const bytesArgs = [
  solidityPacked(["uint256"], [tokenId]),
  solidityPacked(["uint256"], [seed]),
];

const response = await simulateScript({
  source,
  args: ["https://cdn.gisthostfor.me/filoozom-4XDZ64lBpn-generate.js"],
  bytesArgs,
  secrets: {},
});

const errorString = response.errorString;

if (errorString) {
  console.log(`❌ Error during simulation: `, errorString);
  process.exit(-1);
}

const decode = (response, type) => {
  const string = response.responseBytesHexstring;

  if (getBytes(string).length > 0) {
    return decodeResult(response.responseBytesHexstring, type);
  }
};

const type = ReturnType.string;
const decoded = decode(response, type);
console.log(`✅ Decoded response to ${type}:`, decoded);
