<script lang="ts">
  import { nfts } from "../stores/nfts";
  import RenderToken from "./RenderToken.svelte";
</script>

<div class="grid grid-cols-3">
  {#each $nfts as nft}
    <div>
      <RenderToken {...nft} />
    </div>
  {/each}
</div>
