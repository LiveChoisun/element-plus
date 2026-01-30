# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Element Plus is a Vue 3 component library built with TypeScript and the Composition API. It's a monorepo managed with pnpm workspaces.

## Common Commands

```bash
pnpm install              # Install dependencies (runs stub and gen:version automatically)
pnpm dev                  # Run playground dev server for testing components
pnpm test                 # Run unit tests with Vitest
pnpm test -- button       # Run tests for a specific component
pnpm test:coverage        # Run tests with coverage report
pnpm lint                 # Run ESLint
pnpm lint:fix             # Auto-fix linting issues
pnpm format               # Format code with Prettier
pnpm typecheck            # Run all TypeScript type checks
pnpm build                # Build the entire library (Gulp-based)
pnpm build:theme          # Build theme-chalk separately
pnpm docs:dev             # Run documentation site locally
pnpm gen                  # Generate new component from template (interactive bash script)
pnpm cz                   # Interactive commit message generator (commitizen)
```

## Architecture

### Monorepo Structure

- **packages/components/** - 124+ UI components, each in its own directory
- **packages/hooks/** - Vue 3 Composition API hooks (shared logic)
- **packages/utils/** - Utility functions shared across components
- **packages/directives/** - Vue directives (click-outside, mousewheel, etc.)
- **packages/constants/** - Shared constants (aria, dates, events, keys, sizes)
- **packages/locale/** - i18n translations (40+ languages)
- **packages/theme-chalk/** - SCSS-based theming system
- **packages/element-plus/** - Main library entry point
- **internal/build/** - Gulp + Rollup build toolchain
- **play/** - Vite-based component playground for development
- **docs/** - VitePress documentation site

### Component Structure Pattern

Each component follows this structure:
```
packages/components/component-name/
├── index.ts              # Exports with withInstall() wrapper
├── src/
│   ├── component.vue     # Vue SFC
│   ├── component.ts      # Props/emits definitions
│   ├── use-component.ts  # Composition hook
│   └── instance.ts       # Type exports
├── __tests__/            # Unit tests
└── style/                # SCSS styles
```

### Key Patterns

- **withInstall()** - Wrapper from `@element-plus/utils` that adds `.install()` method for `app.use()` registration
- **useNamespace()** - Hook for BEM-style class name generation
- **buildProps()** - Utility for defining component props with TypeScript support
- **definePropType()** - Helper for complex prop type definitions

### Build System

- **Gulp** orchestrates the build pipeline (`internal/build/gulpfile.ts`)
- **Rollup** bundles to ESM (`es/`) and CommonJS (`lib/`)
- **SCSS** compiles theme-chalk styles
- Output goes to `dist/` directory

### Testing

- **Vitest** with jsdom environment
- Test files in `__tests__/` directories alongside components
- Vue Test Utils for component mounting
- Coverage excludes: play/, lang/, style/, scripts/, ssr-testing/

## Code Style

- No semicolons, single quotes, ES5 trailing commas (Prettier)
- Commit format: `type(scope): description` (conventional commits)
- Pre-commit hooks run ESLint, Prettier via lint-staged

## Prerequisites

- Node.js >= 20
- pnpm >= 10.18
