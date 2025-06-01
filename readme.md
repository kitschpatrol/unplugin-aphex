# unplugin-apple-photos [![npm](https://img.shields.io/npm/v/unplugin-apple-photos.svg)](https://npmjs.com/package/unplugin-apple-photos)

[![Unit Test](https://github.com/sxzz/unplugin-apple-photos/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/unplugin-apple-photos/actions/workflows/unit-test.yml)

Starter template for [unplugin](https://github.com/unjs/unplugin).

<!-- Remove Start -->

## Template Usage

To use this template, clone it down using:

```bash
npx degit sxzz/unplugin-apple-photos unplugin-my-plugin
```

And do a global replacement of `unplugin-apple-photos` with your plugin name.

Then you can start developing your unplugin 🔥

To run unit tests, run: `pnpm run test`.
To release a new version, run: `pnpm run release`.

<!-- Remove End -->

## Installation

```bash
npm i -D unplugin-apple-photos
```

<details>
<summary>Vite</summary><br>

```ts
// Vite.config.ts
import Starter from 'unplugin-apple-photos/vite'

export default defineConfig({
  plugins: [Starter()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// Rollup.config.js
import Starter from 'unplugin-apple-photos/rollup'

export default {
  plugins: [Starter()],
}
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```ts
// Rolldown.config.js
import Starter from 'unplugin-apple-photos/rolldown'

export default {
  plugins: [Starter()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import { build } from 'esbuild'
import Starter from 'unplugin-apple-photos/esbuild'

build({
  plugins: [Starter()],
})
```

<br></details>

<details>
<summary>webpack</summary><br>

```js
// Your webpack.config.js
import Starter from 'unplugin-apple-photos/webpack'

export default {
  /* ... */
  plugins: [Starter()],
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// Rspack.config.js
import Starter from 'unplugin-apple-photos/rspack'

export default {
  /* ... */
  plugins: [Starter()],
}
```

<br></details>

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025-PRESENT [三咲智子](https://github.com/sxzz)
