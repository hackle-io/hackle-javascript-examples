# Hackle Next.js ServerSide Variation Demo

## Prerequisite

1. SDK KEY

Enter the sdk key in `.env` > `NEXT_PUBLIC_HACKLE_SDK_KEY`

```shell
NEXT_PUBLIC_HACKLE_SDK_KEY=YOUR_SDK_KEY
```

## Contents

1. useLoadableVariation

using `useLoadableVariationDetail` hooks, `isLoading` field can make client-side rendering with each variation.

2. server side variation

By using `hackleClient.variation(...args)` in `getServerSideProps`, hackleClient is working on server side. so you can avoid flickering issue.
