# create-my-backend

An interactive CLI to scaffold backend projects with your preferred framework, database, ORM, architecture, and development tools.

**Build your backend faster. Focus on building your product.**

## Overview

`create-my-backend` is an interactive backend project generator that helps developers set up a backend project without manually configuring everything from scratch.

Choose your preferred stack, select the features you need, and generate a ready-to-customize project structure.

## Features

- Interactive CLI setup
- Framework selection
- Database configuration
- ORM selection
- Modular or minimal architecture
- Optional development tools
- Package manager selection
- Automatic project file generation
- Optional dependency installation

## Tech Stack

The CLI is built with:

- TypeScript
- Bun
- Commander
- @clack/prompts
- tsup

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (required to run the CLI in the current development setup)

### Installation

Clone the repository:

```bash
git clone https://github.com/dev-rakibulislam/create-my-backend.git
cd create-my-backend
```

Install dependencies:

```bash
bun install
```

Build the CLI:

```bash
bun run build
```

### Run Locally

```bash
bun run src/index.ts
```

Or run the built CLI:

```bash
bun run dist/index.js
```

## Usage

Start the CLI:

```bash
create-my-backend
```

Follow the interactive prompts to configure your backend project.

You can choose from the following options:

### Framework

- Express

### Database

- PostgreSQL
- None

### ORM

- Prisma
- None

### Architecture

- Modular
- Minimal

### Optional Features

Select the tools you want in your project:

- Zod — Request validation
- Pino — Logging
- CORS — Cross-origin resource sharing
- Rate Limiter — API rate limiting
- Docker — Container configuration
- Vitest — Testing

### Package Manager

- Bun
- npm
- pnpm
- Yarn

> Available options may change as the project evolves.

## Example Workflow

```text
$ create-my-backend

? Project name: my-api
? Select framework: Express
? Select database: PostgreSQL
? Select ORM: Prisma
? Select architecture: Modular

? Select additional features:
  ◉ Zod Validation
  ◉ Pino Logger
  ◯ CORS
  ◯ Rate Limiter
  ◯ Docker
  ◯ Vitest

? Package manager: Bun

✔ Project created successfully!
```

*Example output for illustration; exact prompts may differ.*

## Project Structure

The generated structure depends on your selected architecture and features.

An example modular structure:

```text
my-api/
├── src/
│   ├── modules/
│   ├── config/
│   ├── middlewares/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Development

Want to contribute or modify the CLI?

```bash
# Clone the repository
git clone https://github.com/dev-rakibulislam/create-my-backend.git

# Enter the project
cd create-my-backend

# Install dependencies
bun install

# Start development
bun run dev

# Build
bun run build
```

## Roadmap

- [x] Interactive CLI foundation
- [x] Express project generation
- [x] Package configuration
- [ ] Improve generated project templates
- [ ] Add Fastify support
- [ ] Add more database options
- [ ] Add more ORM integrations
- [ ] Add template testing
- [ ] Publish to npm
- [ ] Community-contributed templates

## Contributing

Contributions are welcome!

If you have an idea, found a bug, or want to add support for a new framework or tool:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Open a Pull Request.

For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made for developers who love building.
</p>
