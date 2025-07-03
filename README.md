 ____        _       _     _     
/ ___|  ___ | | ___ (_)___| |_   
\___ \ / _ \| |/ _ \| / __| __|  
 ___) | (_) | | (_) | \__ \ |_ _ 
|____/ \___/|_|\___/|_|___/\__(_)

## <img src="public/solologo.png" alt="Soloist Logo" height="28" style="vertical-align:bottom; margin-right:6px;"> Soloist

**Version:** `1.6.5` | **License:** For-Profit Open Source | **Status:** Active Development

---

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=101010)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&labelColor=101010)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white&labelColor=101010)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&labelColor=101010)](https://tailwindcss.com/) [![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron&logoColor=white&labelColor=101010)](https://www.electronjs.org/) [![Convex](https://img.shields.io/badge/Convex_DB-1.24-450AFF?logo=data%3Adownload&logoColor=white&labelColor=101010)](https://convex.dev/) [![Resend](https://img.shields.io/badge/Resend-Email-000000?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI%2BPHBhdGggZD0ibTQgNCA2IDYgNi02Ii8%2BPHBhdGggZD0ibTQgMTEgNiA2IDYtNiIvPjwvc3ZnPg%3D%3D&logoColor=white&labelColor=101010)](https://resend.com/) [![OpenAI](https://img.shields.io/badge/OpenAI-Node-000000?logo=openai&logoColor=white&labelColor=101010)](https://openai.com/) [![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?logo=vercel&logoColor=white&labelColor=101010)](https://vercel.com/)

## About

**Soloist** is a personal analytics platform that turns day-to-day experiences into actionable insights through intelligent tracking and predictive analysis. Our goal is act as your weather forecast for your mood. Our objective is to make it easier for our Users to understand themselves, correct unwanted behaviours, and align their futureselves with who they want to be.

### Key Features

| Category | Highlights |
|----------|------------|
| Daily Logging | Custom templates, auto-summaries, progressive prompts |
| Predictive Analytics | 3-day forecasts, yearly heat-map, pattern detection |
| AI Cost Tracking | Real-time OpenAI usage monitoring, cost analytics, feature breakdown |
| Admin Dashboard | Live usage statistics, cost alerts, model performance metrics |
| Integrations | Social feed import (Facebook, Instagram, X / Twitter, LinkedIn) |
| Starter Kits | Guided 7-day journaling programme (coming Q4 2025) |
| Desktop Experience | Native macOS / Windows / Linux apps built with Electron |

---

## Downloads

| Platform | File | Direct Link |
|----------|------|-------------|
| macOS (Intel) | `Soloist.Pro-1.6.5-x64.dmg` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5-x64.dmg) |
| macOS (Apple Silicon) | `Soloist.Pro-1.6.5-arm64.dmg` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5-arm64.dmg) |
| Windows | `Soloist.Pro-Setup-1.6.5.exe` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-Setup-1.6.5.exe) |
| Linux (AppImage) | `Soloist.Pro-1.6.5.AppImage` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5.AppImage) |
| Linux (Deb) | `solopro-electron-1.6.5.deb` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.5/solopro-electron-1.6.5.deb) |

---

## Quick Start

```bash
# Clone
git clone https://github.com/acdc-digital/solopro.git
cd solopro

# Install dependencies (pnpm recommended)
pnpm install

# Start Dev Environment
pnpm dev          # boots website, renderer and Electron shell
```

Build desktop installers locally:

```bash
pnpm --filter solopro-electron run build:mac     # macOS dmg
pnpm --filter solopro-electron run build:win     # Windows exe (needs Wine)
pnpm --filter solopro-electron run build:linux   # Linux AppImage + Deb (needs Docker)
```

Outputs are written to `electron/dist/`.

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Boot website, renderer, Electron shell |
| `pnpm dev:renderer` | Next.js renderer only (port 3002) |
| `pnpm dev:website` | Marketing site only (port 3004) |
| `pnpm dev:electron` | Electron window with live-reload |

## Deployment Commands

| Command | Description |
|---------|-------------|
| `pnpm run deploy:all` | Deploy website **and** renderer to Vercel Prod |
| `pnpm run deploy:website` | Deploy website only |
| `pnpm run deploy:renderer` | Deploy renderer only |

## Version Management (Git)

```bash
# Bump version, tag & push
npm version <patch|minor|major>
git push origin main --tags

# Reset to a specific version
git checkout v1.6.5
```

## Git Command Reference

| Purpose | Command | Notes |
|---------|---------|-------|
| Clone repository | `git clone https://github.com/acdc-digital/solopro.git` | Creates local copy of remote repo |
| List branches | `git branch -a` | `-a` shows local & remote |
| Create feature branch | `git checkout -b feature/<name>` | Based off current branch (usually `main`) |
| Stage all changes | `git add .` | Use `git add <file>` for single files |
| Amend staged file list | `git restore --staged <file>` | Unstage a file before commit |
| Commit staged changes | `git commit -m "feat: concise message"` | Conventional commits recommended |
| Push branch to origin | `git push -u origin feature/<name>` | `-u` sets upstream for future `git push` |
| Fetch & merge remote main | `git pull origin main` | Keeps branch up-to-date before PR |
| Rebase onto main | `git fetch origin && git rebase origin/main` | Cleaner history (resolve conflicts if any) |
| Squash last N commits | `git rebase -i HEAD~N` | Use interactive rebase; replace `pick` with `squash` |
| Switch branches | `git checkout <branch>` | Or `git switch <branch>` |
| Delete local branch | `git branch -d feature/<name>` | Use `-D` to force delete |
| Create version tag | `git tag v1.6.5` | Lightweight tag |
| Annotated version tag | `git tag -a v1.6.5 -m "Soloist v1.6.5"` | Preferred for releases |
| Push single tag | `git push origin v1.6.5` | Uploads tag to remote |
| Push all tags | `git push --tags` | After multiple new tags |
| Remove remote tag | `git push --delete origin v1.6.1` | Keep history tidy |
| Stash work-in-progress | `git stash push -m "wip"` | Temporarily save uncommitted work |
| List stashes | `git stash list` | Shows stash stack |
| Apply & keep stash | `git stash apply stash@{0}` | Use `pop` to apply & drop |
| View commit history | `git log --oneline --graph --decorate --all` | Compact visual graph |
| Undo local commit (keep changes) | `git reset --soft HEAD~1` | Moves `HEAD` back one commit |
| Hard reset to origin | `git reset --hard origin/main` | **Destroys** local changes |

> Tip: configure aliases in `~/.gitconfig` to speed up frequent commands.

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| **v1.6.5** | 2025-01-22 | 💰 OpenAI cost tracking & analytics, real-time usage monitoring, admin dashboard |
| **v1.6.4** | 2025-01-29 | Enhanced security & authentication, email verification, password management |
| **v1.6.2** | 2025-02-01 | Guided journaling starter kit, social platform integration preview, refined macOS dock icon |
| **v1.6.1** | 2025-01-17 | Build & notarisation improvements |
| **v1.6.0** | 2024-12-31 | UI/UX enhancements |

---

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

© 2025 ACDC.digital • Maintainer: msimon@acdc.digital