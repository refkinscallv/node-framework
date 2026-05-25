# @refkinscallv/create-node-framework

Scaffold a new [Node Framework](https://github.com/refkinscallv/node-framework) project in seconds.

## Usage

```bash
# npm
npm create @refkinscallv/node-framework my-app

# npx
npx @refkinscallv/create-node-framework my-app

# pnpm
pnpm create @refkinscallv/node-framework my-app

# yarn
yarn create @refkinscallv/node-framework my-app
```

If you omit the project name, the CLI will prompt for it interactively.

## Options

| Flag | Description |
|------|-------------|
| `--skip-install` | Skip dependency installation |
| `--skip-setup` | Skip `.env` generation and JWT key setup |
| `--pm <manager>` | Package manager: `npm` \| `yarn` \| `pnpm` (auto-detected) |
| `-v, --version` | Print version |

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## What it does

1. Downloads the latest [node-framework](https://github.com/refkinscallv/node-framework) template
2. Installs dependencies with your package manager
3. Runs `npm run setup` to copy `.env.example` → `.env` and generate secure JWT keys
4. Prints next steps

## License

MIT © [Refkinscallv](https://github.com/refkinscallv)
