<script>
  import { explorer, nftAddress } from "../lib/provider";

  import { formatAddress } from "../lib/utils";
</script>

<div class="text-center text-xl mt-4">
  Contract address:
  <a
    href="{explorer}/address/{nftAddress}"
    target="_blank"
    class="underline"
    title={nftAddress}>{formatAddress(nftAddress)}</a
  >, deployed on
  <a href="https://arbitrum.io/" target="_blank" class="underline"
    >Arbitrum Sepolia</a
  >, using
  <a href="https://www.blockscout.com/" target="_blank" class="underline"
    >Blockscout</a
  >
</div>
