import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import { encode as rawEncode, code as rawCode } from "multiformats/codecs/raw";

export const calculateBlobCID = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const renderHash = await sha256.digest(rawEncode(bytes));
  return CID.create(1, rawCode, renderHash);
};
