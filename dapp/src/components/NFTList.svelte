<script lang="ts">
  import { explorer } from "../lib/provider";
  import { formatAddress } from "../lib/utils";
  import { nfts } from "../stores/nfts";
  import RenderToken from "./RenderToken.svelte";
</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3">
  {#each $nfts as nft}
    <div class="group w-full relative">
      <RenderToken tokenId={nft.tokenId} seed={nft.seed} hash={nft.hash} />

      <div
        class="h-full opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 flex justify-center text-xl items-center text-black bg-gray-200 bg-opacity-75 flex-col gap-4 text-center"
      >
        {#if nft.transactionHash}
          <p>
            Minted in<br />
            <a
              href="{explorer}/tx/{nft.transactionHash}"
              target="_blank"
              class="underline"
              title={nft.transactionHash}
            >
              {formatAddress(nft.transactionHash)}
            </a>
          </p>
        {/if}

        {#if nft.hash}
          <p>
            IPFS CID:<br />
            <a
              href="https://gateway.lighthouse.storage/ipfs/{nft.hash}"
              target="_blank"
              class="underline"
              title={nft.hash}
            >
              {formatAddress(nft.hash)}
            </a>
          </p>
        {:else}
          No hash yet (locally rendered)
        {/if}

        {#if nft.chainlinkTransactionHash}
          <p>
            Chainlink function fullfilled in:<br />
            <a
              href="{explorer}/tx/{nft.chainlinkTransactionHash}"
              target="_blank"
              class="underline"
              title={nft.hash}
            >
              {formatAddress(nft.chainlinkTransactionHash)}
            </a>
          </p>
        {/if}
      </div>
    </div>
  {/each}
</div>
