# Chainlink Functions

## Usage

The function simulation can be ran with:

```bash
pnpm install
node simulate.js
```

The `tokenId` and `seed` can be changed to match a minted one to compare CIDs.

## Note

I would've loved to be able to do something like:

```ts
const { generateImage, getImageConfig, generateMetadata } = await import(args[0]);
```

However, it seems like this results in the following Chainlink error:

```
TypeError: Requires net access to "MY_URL", run again with the --allow-net flag
```
