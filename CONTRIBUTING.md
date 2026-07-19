# Contributing

## Branching model

| Branch | Purpose |
|--------|---------|
| `main` | Production. Every merge here triggers a release. |
| `develop` | Integration branch for the next release. |
| `feat/*`, `fix/*`, `chore/*` | Short-lived branches for individual changes. |

Flow:

```
feat/my-change  ──PR──▶  develop  ──PR──▶  main  ──▶  release
```

1. Branch off `develop`.
2. Open a PR into `develop`. CI runs lint, format and typecheck.
3. When ready to release, open a PR from `develop` into `main`.
4. Merging into `main` kicks off the automated release (see below).

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/). The type
determines the version bump:

| Type | Example | Version bump |
|------|---------|--------------|
| `fix` | `fix: correct balance rounding` | patch (2.2.0 → 2.2.1) |
| `feat` | `feat: add annual chart` | minor (2.2.0 → 2.3.0) |
| `feat!` / `BREAKING CHANGE:` | `feat!: drop SDK 50 support` | major (2.2.0 → 3.0.0) |
| `docs`, `chore`, `refactor`, `test`, `ci`, `perf` | | no release on their own |

Commit messages are validated locally by a `commit-msg` git hook
(commitlint + husky). A malformed message is rejected before it is committed.

## Automated release

Releases are handled by [release-please](https://github.com/googleapis/release-please):

1. When commits land on `main`, release-please opens (or updates) a **Release PR**
   that bumps the version and updates `CHANGELOG.md` based on the commits.
2. Review and merge that Release PR when you want to ship.
3. On merge, release-please tags the release and the workflow publishes an
   **EAS OTA update** to the `production` channel.

The version is stored in `package.json` and read by `app.config.js`, so it is
managed in a single place.

## Building a new APK

OTA updates only ship JavaScript/asset changes. A new native build is required
when you add a native dependency, change native config, or bump the Expo SDK.

- **From GitHub:** Actions tab → **EAS Build** → *Run workflow* → pick a profile.
- **Locally:** `npm run build:production` (or `build:development`).

## Useful scripts

```bash
npm run lint        # eslint
npm run format      # prettier check
npm run typecheck   # tsc --noEmit
npm run dev         # start dev client (development variant)
```
