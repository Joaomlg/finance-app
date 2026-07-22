# Contributing

## Branching model

We follow a single-trunk (GitHub Flow) model.

| Branch | Purpose |
|--------|---------|
| `main` | The trunk. Always releasable. Protected. |
| `feat/*`, `fix/*`, `chore/*` | Short-lived branches for individual changes. |

Flow:

```
feat/my-change  ──PR──▶  main  ──▶  release-please Release PR  ──▶  release
```

1. Branch off `main`.
2. Open a PR into `main`. CI runs lint, format and typecheck.
3. On merge, release-please gathers the changes into a **Release PR** — this is
   your "about to ship" staging view. Merge it when you want to release.

There is no `develop` branch: the Release PR plays the role of staging the next
release, so unreleased work simply lives on `main` until the Release PR is merged.

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

## Running on a physical device from WSL2 (Windows)

To scan the Expo QR code / connect a physical phone to Metro when developing inside WSL2, WSL needs to share your Windows machine's network (so your phone can reach it) instead of using its own isolated IP.

1. Enable WSL2 mirrored networking. Edit (or create) `%UserProfile%\.wslconfig` on Windows:

   ```ini
   [wsl2]
   networkingMode=mirrored

   [experimental]
   hostAddressLoopback=true
   ```

   Then restart WSL from Windows (PowerShell/cmd, not from inside WSL):

   ```
   wsl --shutdown
   ```

2. Set your Wi-Fi network profile to **Private** (Public profiles block inbound connections from other devices by default). In an elevated PowerShell:

   ```powershell
   Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
   ```

3. Allow Metro's port through Windows Firewall. Program-based rules (e.g. for `node.exe`) don't cover WSL processes under mirrored networking, so add an explicit port rule in an elevated PowerShell:

   ```powershell
   New-NetFirewallRule -DisplayName "Metro Bundler (WSL2)" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow -Profile Private
   ```

After this, `npm start` / `npm run dev` works as-is — no special script or port-forwarding needed. WSL's IP will match your Windows Wi-Fi IP (verify with `ip addr` in WSL vs `ipconfig` on Windows).

## Useful scripts

```bash
npm run lint        # eslint
npm run format      # prettier check
npm run typecheck   # tsc --noEmit
npm run dev         # start dev client (development variant)
```
