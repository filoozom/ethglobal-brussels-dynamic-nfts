export const loadMetadata = async (
  hash: string
): Promise<{
  name: string;
  description: string;
  image: `ipfs://${string}`;
  attributes?: [
    {
      trait_type: string;
      value: number;
    }
  ];
}> => {
  const response = await fetch(
    `https://gateway.lighthouse.storage/ipfs/${hash}`
  );
  return await response.json();
};
