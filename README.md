## Soloist

**Version:** `1.6.2` | **License:** For-Profit Open Source | **Status:** Active Development

---

## About

**Soloist** is a personal analytics platform that turns day-to-day experiences into actionable insights through intelligent tracking and predictive analysis.

### Key Features

| Category | Highlights |
|----------|------------|
| Daily Logging | Custom templates, auto-summaries, progressive prompts |
| Predictive Analytics | 3-day forecasts, yearly heat-map, pattern detection |
| Integrations | Social feed import (Facebook, Instagram, X / Twitter, LinkedIn) |
| Starter Kits | Guided 7-day journaling programme (new in 1.6.2) |
| Desktop Experience | Native macOS / Windows / Linux apps built with Electron |

---

## Downloads

| Platform | File | Direct Link |
|----------|------|-------------|
| macOS (Intel) | `Soloist.Pro-1.6.2-x64.dmg` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-1.6.2-x64.dmg) |
| macOS (Apple Silicon) | `Soloist.Pro-1.6.2-arm64.dmg` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-1.6.2-arm64.dmg) |
| Windows | `Soloist.Pro-Setup-1.6.2.exe` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-Setup-1.6.2.exe) |
| Linux (AppImage) | `Soloist.Pro-1.6.2.AppImage` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.2/Soloist.Pro-1.6.2.AppImage) |
| Linux (Deb) | `solopro-electron-1.6.2.deb` | [Download](https://github.com/acdc-digital/solopro/releases/download/v1.6.2/solopro-electron-1.6.2.deb) |

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

## Version History

| Version | Date | Notes |
|---------|------|-------|
| **v1.6.2** | 2025-02-01 | Guided journaling starter kit, social platform integration preview, refined macOS dock icon |
| **v1.6.1** | 2025-01-17 | Build & notarisation improvements |
| **v1.6.0** | 2024-12-31 | UI/UX enhancements |
| **v1.5.0** | 2024-12-30 | Infrastructure & components |
| **v1.4.2** | 2024-12-29 | Bug fixes & stability |

---

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

© 2025 ACDC.digital • Maintainer: msimon@acdc.digital