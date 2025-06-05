# Hackle Next.js ServerSide Variation Demo

## Quick start

1. SDK KEY

Enter the sdk key in `.env` > `NEXT_PUBLIC_HACKLE_SDK_KEY`

```shell
NEXT_PUBLIC_HACKLE_SDK_KEY=YOUR_SDK_KEY
```

2. Install

```shell
pnpm install
```

3. Start

```shell
pnpm dev
```

## Contents

1. [useLoadableVariation](https://github.com/hackle-io/hackle-javascript-examples/blob/main/nextjs13-react18-variation/src/pages/loadable.tsx)

using `useLoadableVariationDetail` hooks, `isLoading` field can make client-side rendering with each variation.

2. [server side variation](https://github.com/hackle-io/hackle-javascript-examples/blob/main/nextjs13-react18-variation/src/pages/server-side.tsx)

By using `hackleClient.variation(...args)` in `getServerSideProps`, hackleClient is working on server side. so you can avoid flickering issue.

3. Cookie + identifier parsing logic
- [middleware](https://github.com/hackle-io/hackle-javascript-examples/blob/main/nextjs13-react18-variation/src/middleware.ts)
- [identifier parser](https://github.com/hackle-io/hackle-javascript-examples/blob/main/nextjs13-react18-variation/src/hackle/users.ts)
- 
