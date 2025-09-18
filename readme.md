<!-- title -->

<!-- banner -->

<!-- badges -->

<!-- short-description -->

<!-- table-of-contents -->

## Overview

## Getting started

### Dependencies

### Installation

```bash
npm i -D unplugin-aphex
```

<details>
<summary>Vite</summary><br>

```ts
// Vite.config.ts
import Starter from 'unplugin-aphex/vite'

export default defineConfig({
  plugins: [Starter()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// Rollup.config.js
import Starter from 'unplugin-aphex/rollup'

export default {
  plugins: [Starter()],
}
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```ts
// Rolldown.config.js
import Starter from 'unplugin-aphex/rolldown'

export default {
  plugins: [Starter()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import { build } from 'esbuild'
import Starter from 'unplugin-aphex/esbuild'

build({
  plugins: [Starter()],
})
```

<br></details>

<details>
<summary>webpack</summary><br>

```js
// Your webpack.config.js
import Starter from 'unplugin-aphex/webpack'

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
import Starter from 'unplugin-aphex/rspack'

export default {
  /* ... */
  plugins: [Starter()],
}
```

<br></details>

## Usage

### Library

#### API

#### Examples

### CLI

#### Commands

#### Examples

## Background

### Motivation

### Implementation notes

### Similar projects

## The future

## Maintainers

_List maintainer(s) for a repository, along with one way of contacting them (e.g. GitHub link or email)._

## Acknowledgments

_State anyone or anything that significantly helped with the development of your project. State public contact hyper-links if applicable._

<!-- contributing -->

<!-- license -->
