<script lang="ts">
  import { BrowserProvider, hexlify } from "ethers";
  import { chainId, chainSpec, nftContract } from "../lib/provider";

  const provider = new BrowserProvider((window as any).ethereum);

  const mint = async () => {
    const signer = await provider.getSigner();
    const contract = nftContract.connect(signer);

    try {
      await (provider as any).send("wallet_switchEthereumChain", [
        { chainId: "0x" + chainId.toString(16) },
      ]);
    } catch (switchError: any) {
      if (switchError.error.code === 4902) {
        try {
          await (provider as any).send("wallet_addEthereumChain", [
            {
              ...chainSpec,
              chainId: "0x" + chainId.toString(16),
            },
          ]);
        } catch (addError: any) {
          console.error(addError);
          return;
        }
      } else {
        return;
      }
    }

    await (contract as any).mint();
  };
</script>

<div class="h-16 flex align-center justify-end items-center">
  <button
    class="me-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    on:click={mint}
  >
    Mint an NFT
  </button>
</div>
