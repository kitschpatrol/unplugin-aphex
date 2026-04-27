<!-- title -->

# @kitschpatrol/unplugin-aphex

<!-- /title -->

<!-- badges -->

[![NPM Package @kitschpatrol/unplugin-aphex](https://img.shields.io/npm/v/@kitschpatrol/unplugin-aphex.svg)](https://npmjs.com/package/@kitschpatrol/unplugin-aphex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- /badges -->

<!-- short-description -->

**Unplugin for module-style image imports from your macOS Photos.app library.**

<!-- /short-description -->

> [!WARNING]
>
> **This plugin's underlying [Apple Photos Export (Aphex) library](https://github.com/kitschpatrol/aphex) is still under development. The library, and this plugin, should not be considered suitable for general use until a 1.0 release.**
>
> This project is open-sourced as a curiosity and for my own convenience, but I suspect it's too niche to be of wide interest or utility. I don't currently plan to spend time adding features for more general use-cases.
>
> It won't work in CI pipelines. It can only target the system's active Photos.app library. It requires an Apple Silicon (`arm64`) Mac. It has not been tested against iCloud Photos libraries, and assets kept only in the cloud (via "Optimize Mac Storage") are unlikely to export successfully.
>
> If you are looking for a proper Apple Photos.app mass-export or backup solution, **I highly recommend using [osxphotos](https://github.com/RhetTbull/osxphotos) instead**.

## Overview

This project wraps the [Aphex](https://github.com/kitschpatrol/aphex) Apple Photos Export library in a unified [unplugin](https://unplugin.unjs.io/) for integration with a range of bundlers and build pipelines (Vite, Rollup, etc.).

Aphex treats your Apple Photos.app library as a virtual file system, allowing you to import specific images by their album name / path from your JavaScript / TypeScript code via the `~aphex/` module prefix:

```ts
import photo from '~aphex/some-photos-album/img_1922.jpeg'

// In Vite dev mode, photo resolves to something like:
console.log(photo) // '/node_modules/.cache/aphex/img_1922-a1b2c3d4.jpeg'
```

Running against a cold cache can be _extremely_ slow and can require foreground UI focus, because certain image export strategies have to manipulate the Photos.app GUI directly. (This is for [regrettable but valid reasons](https://github.com/RhetTbull/osxphotos/discussions/1522).)

This readme only covers the basics of using the build plugin; please see the [Aphex project readme](https://github.com/kitschpatrol/aphex) for more details on the underlying functionality and export options.

## Getting started

### Dependencies

Requires macOS with Photos.app installed and [Node 22.18.0](https://nodejs.org/en/download/) or newer. Currently, only an `arm64` (Apple Silicon) build of the requisite native binary is provided by the bundled Aphex library.

Various image processing features (format conversion, resizing, compression, perceptual diffing, etc.) rely on external binaries installed via [Homebrew](https://brew.sh). See the [Aphex readme](https://github.com/kitschpatrol/aphex) for which tool powers which feature — the list below covers every binary any code path might invoke, and you can skip tools for formats or operations you don't use.

### Installation

#### 1. Install the plugin package

```bash
# Optional: image-processing tools. Install only what you need.
brew install libavif mozjpeg imagemagick webp dssim ffmpeg guetzli oxipng

npm i -D @kitschpatrol/unplugin-aphex
```

#### 2. Add the plugin to your bundler's configuration file

<details open>
<summary>Vite</summary><br>

```ts
// Your vite.config.ts
import Aphex from '@kitschpatrol/unplugin-aphex/vite'

export default defineConfig({
  plugins: [Aphex()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// Your rollup.config.js
import Aphex from '@kitschpatrol/unplugin-aphex/rollup'

export default {
  plugins: [Aphex()],
}
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```ts
// Your rolldown.config.js
import Aphex from '@kitschpatrol/unplugin-aphex/rolldown'

export default {
  plugins: [Aphex()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import Aphex from '@kitschpatrol/unplugin-aphex/esbuild'
import { build } from 'esbuild'

build({
  plugins: [Aphex()],
})
```

<br></details>

<details>
<summary>webpack</summary><br>

```js
// Your webpack.config.js
import Aphex from '@kitschpatrol/unplugin-aphex/webpack'

export default {
  /* ... */
  plugins: [Aphex()],
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// Your rspack.config.js
import Aphex from '@kitschpatrol/unplugin-aphex/rspack'

export default {
  /* ... */
  plugins: [Aphex()],
}
```

<br></details>

<details>
<summary>Farm</summary><br>

```ts
// Your farm.config.js
import Aphex from '@kitschpatrol/unplugin-aphex/farm'

export default {
  plugins: [Aphex()],
}
```

<br></details>

#### 3. Configure TypeScript (Optional)

_Skip this step if you're using plain JavaScript._

Add the extension declarations to your [types](https://www.typescriptlang.org/tsconfig#types) in tsconfig.json:

```json
{
  "compilerOptions": {
    "types": ["@kitschpatrol/unplugin-aphex/client"]
  }
}
```

Alternatively, you can add a triple-slash package dependency directive to your global types file (e.g. `env.d.ts` or similar):

```ts
/// <reference types="@kitschpatrol/unplugin-aphex/client" />
```

This step should take care of errors like:

```sh
Cannot find module '~aphex/some-album/some-photo' or its corresponding type declarations.ts(2307)
```

#### 4. Notify ESLint (Optional)

If you use the [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x) plugin or similar, you may need to whitelist the `~aphex/` module prefix in the [import-x/no-unresolved](https://github.com/un-ts/eslint-plugin-import-x/blob/v4.16.1/docs/rules/no-unresolved.md) rule in your ESLint config:

```json
{
  "rules": {
    "import/no-unresolved": ["error", { "ignore": ["^~aphex/"] }]
  }
}
```

#### 5. Install VS Code preview extension (Optional)

If you're using VS Code, an [extension](https://github.com/kitschpatrol/vscode-aphex-preview) is available to provide hover-previews for Aphex file paths:

Install the extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=kitschpatrol.aphex-preview), or run the following in VS Code's command palette:

```sh
ext install kitschpatrol.aphex-preview
```

## Usage

Any module imports prefixed with `~aphex/` will be exported from Photos.app, processed, and cached to a project-local directory. The string path to the exported image is returned from the import statement.

For now, the (many) plugin option arguments are documented via inline JSDoc comments.

## Maintainers

[kitschpatrol](https://github.com/kitschpatrol)

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/unplugin-aphex/issues) are welcome and appreciated.

Please open an issue to discuss changes before submitting a pull request. Unsolicited PRs (especially AI-generated ones) are unlikely to be merged.

This repository uses [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) (via its `ksc` CLI) for linting and formatting, plus [MDAT](https://github.com/kitschpatrol/mdat) for readme placeholder expansion.

<!-- /contributing -->

## Disclaimer

This is an unofficial library and is not affiliated with or blessed by Apple Inc.

The underlying library's core export commands maintain a "read-only" relationship with your library.

None of the code paths should modify the contents of your Photos.app library. But regardless, strange things can happen — please back up your Photos.app library before using this tool.

This tool has _not_ been tested with iCloud-based Photos libraries.

<!-- license -->

## License

[MIT](license.txt) © [Eric Mika](https://ericmika.com)

<!-- /license -->
