import CanvasKitInit, {
  type CanvasKit,
  type EmulatedCanvas2D,
} from "canvaskit-wasm";
import { newRNG } from "./utils";

// Global
let CanvasKit: CanvasKit | undefined;

// Types
type Canvas = Omit<
  EmulatedCanvas2D,
  "dispose" | "decodeImage" | "loadFont" | "makePath2D"
>;

type Config = {
  getImageConfig: () => { width: number; height: number };
  generateImage: (
    canvas: Canvas,
    rng: (min: number, max?: number) => number
  ) => { canvas: HTMLCanvasElement; blob: Blob };
};

export const initCanvasKit = async () => {
  if (!CanvasKit) {
    CanvasKit = await CanvasKitInit({
      locateFile: (file) => "/node_modules/canvaskit-wasm/bin/" + file,
    });
  }

  return CanvasKit;
};

export const copyCanvas = (from: HTMLCanvasElement, to: HTMLCanvasElement) => {
  // Copy size
  to.width = from.width;
  to.height = from.height;

  // Copy content
  const ctx = to.getContext("2d");
  if (!ctx) {
    throw new Error("No canvas context, should not happen");
  }

  ctx.drawImage(from, 0, 0);
};

export const copyCanvasKitToCanvas = async (
  canvasKit: EmulatedCanvas2D,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No canvas context, should not happen");
  }

  const dataUrl = await canvasKit.toDataURL();
  const image = new Image();
  image.onload = () => ctx.drawImage(image, 0, 0);
  image.src = dataUrl;
};

export const renderCanvasKit = async (
  { getImageConfig, generateImage }: Config,
  seed: number
) => {
  const CanvasKit = await initCanvasKit();
  const config = getImageConfig();

  // Generate image
  const canvas = CanvasKit.MakeCanvas(config.width, config.height);
  generateImage(canvas, newRNG(seed));

  // Get blob (CanvasKit)
  const dataUrl = await canvas.toDataURL();
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Copy to canvas
  const copy = document.createElement("canvas");
  await copyCanvasKitToCanvas(canvas, copy);

  return { canvas: copy, blob };
};

export const renderCanvas = async (
  { getImageConfig, generateImage }: Config,
  seed: number
) => {
  const config = getImageConfig();

  // Resize canvas
  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;

  // Render image
  generateImage(canvas, newRNG(seed));

  // Render and convert to blob
  const blob = await new Promise((resolve: BlobCallback) =>
    canvas.toBlob(resolve, "image/png")
  );

  return { canvas, blob };
};
