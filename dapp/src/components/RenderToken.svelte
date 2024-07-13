<script lang="ts">
  // Lib
  import { renderCanvas } from "../lib/canvas";
  import { loadMetadata } from "../lib/metadata";

  // Image config
  // @ts-expect-error external link
  import * as imageConfig from "https://cdn.gisthostfor.me/filoozom-4XDZ64lBpn-generate.js";

  // Bind
  let error = false;
  let rendered: string | undefined;
  let imageUrl: string | undefined;

  // Config
  export let tokenId: bigint;
  export let seed: bigint;
  export let hash: string | undefined = undefined;

  const render = async () => {
    if (rendered) {
      return;
    }

    const { canvas: source } = await renderCanvas(imageConfig, Number(seed));
    rendered = source.toDataURL("image/png");
  };

  const loadNFT = async () => {
    if (!hash) {
      return;
    }

    try {
      const metadata = await loadMetadata(hash);
      imageUrl = metadata.image.replace(
        "ipfs://",
        "https://gateway.lighthouse.storage/ipfs/"
      );
    } catch (err) {
      error = true;
    }
  };

  const onload = (element: HTMLElement) => {
    const listener = () => {
      error = true;
      element.removeEventListener("error", listener);
    };

    element.addEventListener("error", listener);
  };

  $: if (!hash || error) {
    render();
  } else {
    loadNFT();
  }
</script>

{#if imageUrl || rendered}
  <img
    src={rendered || imageUrl}
    alt="Token {tokenId}"
    use:onload
    class:opacity-50={!hash}
    class:opacity-75={error}
  />
{/if}
