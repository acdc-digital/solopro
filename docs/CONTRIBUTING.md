# Contributing to Soloist Pro

We're excited that you're interested in contributing to Soloist Pro! This document will guide you through the process of setting up your development environment and submitting your contributions.

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))

### Development Setup

1. **Fork the Repository**
   
   Click the "Fork" button at the top of the [Soloist Pro repository](https://github.com/acdc-digital/solopro) to create your own copy.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/solopro.git
   cd solopro
   ```

3. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/acdc-digital/solopro.git
   ```

4. **Install Dependencies**

   ```bash
   pnpm install
   ```

5. **Set Up Environment**

   ```bash
   # Copy environment template (if available)
   cp .env.example .env
   
   # Follow setup instructions in docs/ENVIRONMENT_SETUP.md
   ```

## 🔧 Development Workflow

### Creating a Feature Branch

1. **Sync with upstream**

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create your feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Use descriptive branch names:
   - `feature/add-dark-mode`
   - `fix/forecast-accuracy-bug`
   - `docs/update-api-documentation`

### Making Changes

1. **Start the development environment**

   ```bash
   # Start all services (recommended)
   pnpm dev
   
   # Or start individual services:
   pnpm dev:renderer    # Electron content (port 3002)
   pnpm dev:website     # Website (port 3004)
   pnpm dev:electron    # Electron window
   ```

2. **Make your changes**
   
   - Follow the existing code style and conventions
   - Write clear, descriptive commit messages
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   # Run tests
   pnpm test
   
   # Build to check for errors
   pnpm build
   
   # Test specific components
   pnpm build:renderer
   pnpm build:website
   pnpm build:electron
   ```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```bash
# Examples:
feat: add AI-powered mood forecasting
fix: resolve heatmap rendering issue
docs: update API documentation
style: improve button hover states
refactor: optimize database queries
test: add unit tests for forecast accuracy
```

### Submitting Your Changes

1. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

2. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request**

   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template completely
   - Link any related issues using `Fixes #123` or `Closes #123`

## 📋 Pull Request Checklist

Before submitting your PR, make sure you've completed the following:

- [ ] **Code Quality**
  - [ ] Code follows existing style conventions
  - [ ] No linting errors (`pnpm lint`)
  - [ ] All tests pass (`pnpm test`)
  - [ ] Build succeeds (`pnpm build`)

- [ ] **Documentation**
  - [ ] Updated relevant documentation
  - [ ] Added JSDoc comments for new functions
  - [ ] Updated README if needed

- [ ] **Testing**
  - [ ] Added tests for new functionality
  - [ ] Tested across different browsers/platforms
  - [ ] Verified no regression in existing features

- [ ] **PR Details**
  - [ ] Clear, descriptive title
  - [ ] Detailed description of changes
  - [ ] Screenshots/GIFs for UI changes
  - [ ] Linked related issues

## 🏗️ Project Structure

Understanding the monorepo structure will help you navigate the codebase:

```
solopro/
├── convex/           # Backend (Convex database & functions)
├── renderer/         # Electron app frontend (Next.js)
├── website/          # Marketing website (Next.js)
├── electron/         # Electron main process
├── docs/            # Documentation
├── scripts/         # Build and deployment scripts
└── test/           # Test utilities
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### 🔧 **Core Features**
- AI forecasting improvements
- New visualization components
- Enhanced mood tracking
- Performance optimizations

### 🎨 **UI/UX**
- Design system improvements
- Accessibility enhancements
- Mobile responsiveness
- Animation and interactions

### 📚 **Documentation**
- API documentation
- User guides
- Developer tutorials
- Code examples

### 🧪 **Testing**
- Unit tests
- Integration tests
- E2E tests
- Performance tests

### 🐛 **Bug Fixes**
- Check our [Issues](https://github.com/acdc-digital/solopro/issues) for known bugs
- Look for issues labeled `good first issue` or `help wanted`

## 🔍 Code Review Process

1. **Automated Checks**
   - All PRs must pass CI/CD checks
   - Code owners will be automatically assigned for review

2. **Review Timeline**
   - Initial response within 2-3 business days
   - Follow-up reviews within 1-2 business days

3. **Review Criteria**
   - Code quality and style
   - Test coverage
   - Documentation completeness
   - Performance impact
   - Security considerations

## 🛡️ Security

If you discover a security vulnerability, please **DO NOT** open a public issue. Instead:

1. Email us at: `security@acdc.digital`
2. Include a detailed description of the vulnerability
3. Provide steps to reproduce (if applicable)
4. Allow us time to address the issue before public disclosure

## 📞 Getting Help

- **Questions**: Open a [Discussion](https://github.com/acdc-digital/solopro/discussions)
- **Bug Reports**: Create an [Issue](https://github.com/acdc-digital/solopro/issues)
- **Feature Requests**: Start a [Discussion](https://github.com/acdc-digital/solopro/discussions)
- **Direct Contact**: `msimon@acdc.digital`

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

## 🏆 Recognition

Contributors will be recognized in:

- Our [Contributors](https://github.com/acdc-digital/solopro/graphs/contributors) page
- Release notes for significant contributions
- Our website's acknowledgments section

## 📄 License

By contributing to Soloist Pro, you agree that your contributions will be licensed under the same license as the project. See [LICENSE](LICENSE) for details.

---

**Thank you for contributing to Soloist Pro!** 🎉

Your contributions help make personal analytics more accessible and powerful for everyone. We appreciate your time and effort in making this project better.

**Built with ❤️ by the community**