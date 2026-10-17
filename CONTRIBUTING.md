# Contributing to Graphixl

Thank you for your interest in contributing to Graphixl! This document provides guidelines and conventions for contributing to the repository.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Branching Strategy](#branching-strategy)
- [Development Workflow](#development-workflow)
- [Code Style and Standards](#code-style-and-standards)
- [Verification and Testing](#verification-and-testing)
- [Dependency Management](#dependency-management)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Security Considerations](#security-considerations)

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat everyone with respect, professionalism, and empathy.

---

## Prerequisites

Before contributing, ensure your environment meets the following requirements:

- **Node.js:** `>= 22` (v22 LTS recommended; see `.nvmrc`)
- **Package Manager:** `pnpm` (`>= 11.15.1`)
- **Git:** Modern Git installation

If you use `nvm` or `fnm`, you can run:

```bash
nvm use
```

---

## Local Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/graphixl.git
   cd graphixl
   ```

2. **Add upstream remote:**

   ```bash
   git remote add upstream https://github.com/aldevvv/graphixl.git
   ```

3. **Install dependencies:**

   Always use a frozen lockfile to ensure deterministic dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Branching Strategy

- `main` is the primary development branch. Direct pushes to `main` are restricted.
- Create topic branches from up-to-date `main` using descriptive prefixes:
  - `feature/<description>` for new capabilities
  - `fix/<description>` for bug fixes
  - `refactor/<description>` for structural improvements without behavioral change
  - `docs/<description>` for documentation updates
  - `chore/<description>` for maintenance and tooling changes

Example:

```bash
git checkout -b feature/link-metadata-extractor
```

---

## Development Workflow

1. Keep branches focused on a single logical change.
2. Synchronize your branch with upstream `main` frequently using `git rebase upstream/main`.
3. Follow commit message conventions (see below).
4. Run all verification checks locally before submitting a pull request.

---

## Code Style and Standards

- **TypeScript:** Strict type checking is enabled. Avoid `any` types; prefer explicit interfaces and Zod schemas for external boundaries.
- **Components:** Follow existing Next.js App Router conventions and shadcn/ui Base Nova patterns.
- **Styling:** Use Tailwind CSS v4 utility classes. Keep class names organized and readable.
- **Formatting:** Respect `.editorconfig` settings (2 spaces, UTF-8 encoding, LF line endings, final newline).
- **ESLint:** Ensure no lint warnings or errors are introduced (`pnpm lint`).
- **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat: add twitter card adapter`
  - `fix: prevent loopback IP in URL resolver`
  - `docs: update architecture diagram`
  - `chore: update pnpm lockfile`

---

## Verification and Testing

Before opening a pull request or requesting review, run the full verification suite:

```bash
# Run lint check
pnpm lint

# Run type check (includes Next.js route type generation)
pnpm typecheck

# Run production build
pnpm build

# Run combined verification
pnpm verify

# Check production dependencies for security vulnerabilities
pnpm audit --prod
```

All of these checks run automatically in the GitHub Actions CI pipeline and must pass.

---

## Dependency Management

To keep the repository lightweight, fast, and secure:

- **Do not install unnecessary packages.** Leverage native web platform APIs and existing libraries whenever possible.
- **Do not modify lockfiles manually.**
- **Preserve security overrides:** Overrides in `pnpm-workspace.yaml` (such as `fflate` overrides for Satori) must be preserved.
- **Audit dependencies:** Every new dependency must have a compatible open-source license (MIT, Apache-2.0, BSD) and zero known production vulnerabilities (`pnpm audit --prod`).

---

## Pull Request Guidelines

1. **Title:** Use a clear, concise Conventional Commits title (e.g., `feat(resolver): add cheerio metadata parser`).
2. **Description:** Explain *what* was changed, *why* it was needed, and any relevant technical decisions.
3. **Checklist:**
   - [ ] Code compiles and passes `pnpm typecheck`
   - [ ] Code passes `pnpm lint`
   - [ ] Production build succeeds with `pnpm build`
   - [ ] `pnpm audit --prod` reports 0 vulnerabilities
   - [ ] Documentation updated where applicable
4. **Review:** Maintainers will review your pull request and may request revisions. Address comments constructively.

---

## Security Considerations

Graphixl fetches external web resources to generate cards. Contributors working on network or parsing features must ensure:

- All external URLs are validated against private, reserved, or internal IP addresses (SSRF mitigation).
- Request timeouts and response payload limits are strictly enforced.
- Extracted content is properly sanitized before rendering in DOM or SVG contexts.

See [SECURITY.md](SECURITY.md) for full security policies and reporting channels.
