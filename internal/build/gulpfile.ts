import path from 'path'
import { copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  epOutput,
  epPackage,
  projRoot,
} from '@element-plus/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'

/**
 * Parse the catalog section from pnpm-workspace.yaml
 * Simple parser that handles the catalog: section format
 */
const parseCatalog = (content: string): Record<string, string> => {
  const catalog: Record<string, string> = {}
  const lines = content.split('\n')

  let inCatalog = false
  for (const line of lines) {
    // Check if we're entering the catalog section
    if (line.trimStart() === 'catalog:') {
      inCatalog = true
      continue
    }

    // If we hit a non-indented line (new section), exit catalog parsing
    if (inCatalog && line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
      break
    }

    // Parse catalog entries (format: '  package-name': version or   package-name: version)
    if (inCatalog && line.trim().length > 0) {
      // Skip comments
      if (line.trim().startsWith('#')) continue

      // Match patterns like:
      //   '@vueuse/core': ^10.11.0
      //   lodash-unified: ^1.0.3
      const match = line.match(/^\s+['"]?([^'":\s]+)['"]?\s*:\s*(.+)$/)
      if (match) {
        const [, pkgName, version] = match
        // Remove trailing comments and trim
        const cleanVersion = version.split('#')[0].trim()
        catalog[pkgName] = cleanVersion
      }
    }
  }

  return catalog
}

const readCatalog = async (): Promise<Record<string, string>> => {
  const workspaceYamlPath = path.resolve(projRoot, 'pnpm-workspace.yaml')
  const workspaceYaml = await readFile(workspaceYamlPath, 'utf-8')
  return parseCatalog(workspaceYaml)
}

const copyPackageJson = async () => {
  const catalog = await readCatalog()
  const pkgContent = await readFile(epPackage, 'utf-8')
  const pkg = JSON.parse(pkgContent)

  // Replace catalog: values in dependencies
  if (pkg.dependencies) {
    for (const [name, version] of Object.entries(pkg.dependencies)) {
      if (version === 'catalog:' && catalog[name]) {
        pkg.dependencies[name] = catalog[name]
      }
    }
  }

  // Replace catalog: values in peerDependencies
  if (pkg.peerDependencies) {
    for (const [name, version] of Object.entries(pkg.peerDependencies)) {
      if (version === 'catalog:' && catalog[name]) {
        pkg.peerDependencies[name] = catalog[name]
      }
    }
  }

  // Replace catalog: values in devDependencies
  if (pkg.devDependencies) {
    for (const [name, version] of Object.entries(pkg.devDependencies)) {
      if (version === 'catalog:' && catalog[name]) {
        pkg.devDependencies[name] = catalog[name]
      }
    }
  }

  await writeFile(
    path.join(epOutput, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n'
  )
}

export const copyFiles = () =>
  Promise.all([
    copyPackageJson(),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(epOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'typings', 'global.d.ts'),
      path.resolve(epOutput, 'global.d.ts')
    ),
    copyFile(
      path.resolve(projRoot, 'LICENSE'),
      path.resolve(epOutput, 'LICENSE')
    ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    runTask('buildHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle
    )
  ),

  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
