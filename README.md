# NeuroFlow Javascript Utilities

# Getting Started
## Installation
```bash
// npm
npm install neuroflow-utils

// pnpm
pnpm add neuroflow-utils

// yarn
yarn add neuroflow-utils

// bun
bun add neuroflow-utils
```

## Using the utilities

```typescript
import { isEqual } from "neuroflow-utils";

const obj1 = { a: 1 }
const obj2 = { a: 1 }
const obj3 = { a: '1' }

isEqual(obj1, obj2); // true
isEqual(obj1, obj3) // false
isEqual(1, 1) // true
isEqual(1, '1') // false
```

# Contributing
## Setup

```bash
# install dependencies
bun install

# test the app
bun test

# build the app, available under dist
bun run build
```

## Publishing
As an invited collaborator on the NPM package, login to your npm account via the command line (`npm login`). Then, simply update the version based on semver standards and run `npm publish`

## License

MIT
