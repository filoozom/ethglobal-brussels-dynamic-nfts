export const newRNG = (seed: number) => (min: number, max?: number) => {
  seed |= 0;
  seed = (seed + 0x9e3779b9) | 0;

  let temp = seed ^ (seed >>> 16);
  temp = Math.imul(temp, 0x21f0aaad);
  temp = temp ^ (temp >>> 15);
  temp = Math.imul(temp, 0x735a2d97);

  if (!max) {
    max = min;
    min = 0;
  }

  const value = ((temp = temp ^ (temp >>> 15)) >>> 0) / 4294967296;
  return Math.floor(value * (max - min + 1) + min);
};
