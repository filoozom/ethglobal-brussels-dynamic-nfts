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
    title={nftAddress}
  >
    {formatAddress(nftAddress)}
  </a>
</div>
