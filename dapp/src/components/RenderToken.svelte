<script lang="ts">
  import { onMount } from "svelte";

  // Lib
  import { copyCanvas, renderCanvas } from "../lib/canvas";

  // Image config
  // @ts-expect-error external link
  import * as imageConfig from "https://cdn.gisthostfor.me/filoozom-4XDZ64lBpn-generate.js";

  // Bind
  let canvas: HTMLCanvasElement;
  let error = false;
  let rendered: string | undefined;

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

  const onload = (element: HTMLElement) => {
    const listener = () => {
      error = true;
      element.removeEventListener("error", listener);
    };

    element.addEventListener("error", listener);
  };

  $: if (!hash || error) {
    render();
  }
</script>

<img
  src={rendered || `https://gateway.lighthouse.storage/ipfs/${hash}`}
  alt="Token {tokenId}"
  use:onload
  class:opacity-50={!hash}
  class:opacity-75={error}
/>
