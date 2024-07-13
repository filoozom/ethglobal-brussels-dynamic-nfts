getImageConfig: () => ({ width: number });

export const getImageConfig = () => ({
  width: 900,
  height: 900,
});

export const generateImage = (canvas, rng) => {
  const { height, width } = getImageConfig();
  const ctx = canvas.getContext("2d");
  const count = rng(500, 1000);

  for (let i = 0; i < count; i++) {
    const size = rng(100);

    ctx.fillStyle = `rgba(${rng(255)}, ${rng(255)}, ${rng(255)}, ${
      rng(100) / 100
    })`;
    ctx.beginPath();
    ctx.ellipse(rng(height), rng(width), size, size, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  return canvas;
};

export const generateMetadata = (rng, _args, bytesArgs) => {
  const tokenId = parseInt(bytesArgs[0]);
  const count = rng(500, 1000);

  return {
    title: `Token ${tokenId}`,
    description: `Token ${tokenId}`,
    attributes: [
      {
        trait_type: "Rarity",
        value: rng(5),
      },
      {
        trait_type: "Circle count",
        value: count,
      },
    ],
  };
};
