## <img src="public/logo-ACDC.svg" alt="ACDC Logo" height="30" align="center"/>

# Soloist.


[![React](https://img.shields.io/badge/React-%2320232A.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-%23000000.svg?style=for-the-badge&logo=OpenAI&logoColor=white)](https://www.openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=Vercel&logoColor=white)](https://vercel.com/)
[![ShadCN/ui](https://img.shields.io/badge/shadcn/ui-%2327272A.svg?style=for-the-badge&logoColor=white)](https://ui.shadcn.com/)
[![Convex DB](https://img.shields.io/badge/Convex_DB-%23450AFF.svg?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev/)

**📊 Version:** `1.6.1` | **📝 License:** For-Profit Open Source | **🚀 Status:** Active Development

[**📖 Documentation**](https://github.com/acdc-digital/solopro/wiki) • [**📋 Project Board**](https://github.com/users/acdc-digital/projects/10) • [**🔖 Release Notes**](https://github.com/acdc-digital/solopro/releases)

</div>

---

## What is Soloist?

**Soloist** is a dynamic personal analytics platform that helps you identify self-patterns and make data-driven decisions about your life. Through intelligent tracking and predictive analysis, Soloist transforms your daily experiences into actionable insights.

### Key Features

- ** Daily Log** - Customizable templates for tracking your daily activities
- ** Auto-Summaries** - AI-generated summaries of your day
- ** Predictive Forecasting** - Get 3-day forecasts based on your 4-day patterns
- ** Dynamic Feed** - Real-time waterfall view of your notes, media, and tags
- ** Playground Mode** - Test forecasts against historical data
- ** 365 Heatmap** - Visualize your entire year at a glance
- ** Smart Profiles** - Enable auto-generation for effortless tracking

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/acdc-digital/solopro.git

# Navigate to project directory
cd solopro

# Install dependencies
pnpm install

# Start development environment
pnpm dev
```

### Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services (recommended) |
| `pnpm dev:renderer` | Start Electron content only (port 3002) |
| `pnpm dev:website` | Start website only (port 3004) |
| `pnpm dev:electron` | Start Electron window only |

### Deployment

| Command | Description |
|---------|-------------|
| `pnpm run deploy:all` | Deploy all services |
| `pnpm run deploy:renderer` | Deploy renderer only |
| `pnpm run deploy:website` | Deploy website only |

---

## 🔧 Development Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to origin
git push origin feature/your-feature-name
```

### Version Management

```bash
# Update version
git add .
git commit -m "chore: bump version to x.x.x"
git tag vx.x.x
git push origin main vx.x.x

# (Optional) Reset to specific version
git reset --hard vx.x.x
```

---

## 📚 Version History

| Version | Date | Description |
|---------|------|-------------|
| **v1.6.1** | 2025-01-17 | **Build & Notarization** - Complete Apple notarization setup, automated build scripts for macOS, enhanced code signing configuration, universal binary support (Intel + Apple Silicon), streamlined development workflow |
| **v1.6.0** | 2024-12-31 | **UI/UX Enhancements** - Enhanced draggable window controls for Electron app with macOS-style traffic lights, improved website navbar with clickable user avatars and dropdown menus, removed floating action button for cleaner interface, added comprehensive user profile management |
| **v1.5.0** | 2024-12-30 | **Infrastructure & Components** - Major UI component library updates, enhanced authentication flow, improved Convex integration, added avatar support across platform |
| **v1.4.2** | 2024-12-29 | **Bug Fixes & Stability** - Critical bug fixes and performance improvements |
| **v1.1.0** | 2024-12-28 | **Foundation Release** - Workspace initialization complete with enhanced authentication, core platform architecture established |

---

## 🤝 Contributing

We believe in the power of community! Soloist is a **For-Profit Open Source** project, and we welcome contributions from developers worldwide.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact & Support

- **Maintainer:** msimon@acdc.digital
- **Company:** [ACDC.digital](https://acdc.digital)
- **Issues:** [GitHub Issues](https://github.com/acdc-digital/solopro/issues)

---

If you find Soloist helpful, please consider giving us a star. It helps us reach more developers and improve the project!

**Built with ❤️ by ACDC.digital**

</div>