# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.5] - 2026-11-02

### Fixed

- Require Unplugin `^3.7.0`, incorporating fixes for webpack, Rspack, esbuild, and Farm adapters.

### Maintenance

- Update runtime requirements to Aphex `^0.1.6`, lognow `^0.8.8`, and Node.js types `~24.13.6`.
- Refresh development dependencies and pnpm 12.16.1, including shared-config 8.14 and bundler, build, and test tooling.
- Build before lint/fix, use cross-platform cleanup through shx, move skill synchronization into pnpm configuration, and update install-script and ESLint peer policies.
- Move dependency-update automation to a monthly schedule, refresh workflow actions, and make link checks ignore loopback URLs and accept empty input.

## [0.2.4] - 2026-10-07

### Changed

- **Breaking:** Restrict supported Node.js versions to `^24.16.0 || >=26.3.0`.

### Fixed

- Warn when ExifTool shutdown fails instead of allowing teardown errors to fail the consumer's build.

### Documentation

- Generate the README's runtime requirements from package metadata, correcting the outdated Node.js requirement.

### Maintenance

- Refresh runtime dependency requirements, including Aphex `^0.1.5`, lognow `^0.8.5`, and Unplugin `^3.4.0`.
- Upgrade development tooling to pnpm 12, Vite 8, Vitest 5, and tsdown 0.23; refresh shared configuration and add contributor-skill synchronization.
- Mark bundler-plugin and Nuxt-module factory calls as pure for build tooling.
- Automate weekly dependency-update pull requests, pin release/metadata actions to commit SHAs, and correct error capture in website link checks.

## [0.2.3] - 2026-08-25

### Changed

- **Breaking:** Raise the minimum supported Node.js version to 24.16.0.

### Documentation

- Refresh npm and MIT license URLs in the README.

### Maintenance

- Refresh runtime dependency requirements, including Aphex `^0.1.3`, Unplugin `^3.3.0`, and lognow `^0.8.0`.
- Upgrade contributor tooling to shared-config 8 and TypeScript 6, refresh pnpm/development dependencies, adapt code to stricter linting, and add VS Code lint/fix tasks.
- Add scheduled link checks for repository Markdown and the project homepage.
- Refresh GitHub Actions, enable pnpm caching in CI, and validate release tags against the repository's default branch.

## [0.2.2] - 2026-05-16

### Changed

- **Breaking:** Raise the minimum supported Node.js version to 24.0.0.

### Maintenance

- Update runtime requirements to Aphex `^0.1.2`, lognow `^0.6.2`, and Node.js types `~24.0.15`.
- Refresh development dependencies, migrate to pnpm 11 and its `allowBuilds` configuration, and apply a 15-second timeout to all Node tests.
- Pass the npm authentication token directly to the publish command in the release script.

## [0.2.1] - 2026-04-29

### Changed

- Expand optional peer support to Nuxt 3/4, Rollup 3/4, Rspack 1/2, and Rolldown >=1.0.0-rc.1.

### Documentation

- Update the README's MIT license link.

### Maintenance

- Update the Aphex dependency requirement to `^0.1.1`.
- Refresh shared configuration and Nuxt development dependencies, and add Rspack and Rolldown development dependencies.

## [0.2.0] - 2026-04-27

### Added

- Add a `/nuxt` module that configures the Vite and webpack plugins through Nuxt's `aphex` configuration key.
- Add `AphexExport.getCachedResult()` to retrieve resolved results without triggering another export.
- Export `AphexImageResultMetadata`, `Options`, and `ResolvedOptions` from `/api`.
- Resolve prepopulated caches on unsupported hosts, skip native session setup, and provide actionable errors when an uncached image requires Apple Silicon macOS.

### Changed

- Report an explicit error when metadata for a virtual image module is missing.

### Removed

- **Breaking:** Remove the public `AphexExport.getAllExportedPaths()`, `getAssetFileName()`, and `readPhotoContent()` methods.

### Fixed

- Resolve Aphex from npm (`^0.1.0`) instead of a sibling filesystem dependency.
- Use processed output dimensions and format in metadata results, falling back to source dimensions and the file extension.
- Warn about unreadable or malformed persistent caches and rewrite malformed caches on the next save.

### Documentation

- Expand usage documentation with option defaults, metadata examples, cache-file guidance, production-only pruning behavior, and API lifecycle JSDoc.
- Correct Vite paths/configuration, the ESLint rule name, and required TypeScript setup instructions.
- Add Nuxt module configuration examples.
- Document installation of the optional VS Code hover-preview extension.

### Maintenance

- Load metadata modules from the existing resolved-result cache instead of maintaining a separate metadata map.
- Add build and lint CI on Linux, macOS, and Windows.
- Refresh development dependencies and pnpm, including Nuxt tooling and Playwright.

## [0.1.0] - 2026-04-22

### Added

- Import Photos.app images by album/path through `~aphex/`, with adapters for Vite, Rollup, Rolldown, esbuild, webpack, Rspack, and Farm.
- Configure Aphex export and image-processing options, optional metadata validation, and verbose export/cache logging.
- Support `returnMetadata` imports containing image format, dimensions, and a cache-relative `src`, with ambient TypeScript declarations through `/client`.
- Persist cache-relative image mappings in `.aphex-plugin-cache.json`, with configurable cache directories, `enabled`, `aggressive`, and `disabled` modes, and stale-entry cleanup.
- Optionally prune unused cached images after production builds while preserving the cache manifest.
- Limit concurrent exports to four by default, deduplicate concurrent requests, and optionally reuse an interactive Photos.app session.
- Expose `AphexExport` and `resolveOptions` through `/api` for programmatic exports, cache management, file access, and resource cleanup.
- Ship an ESM package with TypeScript declarations, requiring Node.js 22.18.0 or newer on Apple Silicon macOS.

### Documentation

- Document npm installation, bundler configuration, TypeScript and ESLint setup, optional Homebrew tools, and Photos.app platform/library limitations.

### Maintenance

- Establish tsdown builds, Node and browser tests, shared linting, and release/repository-metadata automation.

[0.1.0]: https://github.com/kitschpatrol/unplugin-aphex/releases/tag/v0.1.0
[0.2.0]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.1.0...v0.2.0
[0.2.1]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.2.0...v0.2.1
[0.2.2]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.2.1...v0.2.2
[0.2.3]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.2.2...v0.2.3
[0.2.4]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.2.3...v0.2.4
[0.2.5]: https://github.com/kitschpatrol/unplugin-aphex/compare/v0.2.4...v0.2.5
