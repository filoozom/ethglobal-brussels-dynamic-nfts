<script lang="ts">
  import { onMount } from "svelte";
  import lighthouse from "@lighthouse-web3/sdk";

  // Image config
  import * as imageConfig from "https://cdn.gisthostfor.me/filoozom-4XDZ64lBpn-generate.js";

  // Lib
  import { copyCanvas, renderCanvas } from "./lib/canvas";
  import { calculateBlobCID } from "./lib/blobs";

  const APIKey = "b05cfb04.e9f5b5bf84144320adbd224e943e206f";

  let canvas: HTMLCanvasElement;
  const seed = 1720872288;

  onMount(async () => {
    const { canvas: rendered, blob } = await renderCanvas(imageConfig, seed);
    if (!blob) {
      return;
    }

    const cid = await calculateBlobCID(blob);

    console.log({ cid: cid.toString() });
    copyCanvas(rendered, canvas);
  });
</script>

<canvas bind:this={canvas} />
