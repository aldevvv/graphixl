# Graphixl

> Turn any link into a visual worth sharing.

Graphixl is an open-source tool for turning URLs into polished, customizable social media cards with live previews and high-resolution image exports.

---

## Overview

Sharing links across modern platforms like Instagram Stories, LinkedIn, X, and messaging apps often produces underwhelming visual previews or requires manual graphic design effort.

Graphixl streamlines this process:

1. **Paste a URL:** Provide any public web link.
2. **Extract Metadata:** Automatically retrieve and normalize website titles, descriptions, branding, and images.
3. **Choose a Template:** Select from pre-designed layouts optimized for readability and aesthetics.
4. **Customize & Preview:** Adjust typography, color palettes, and aspect ratios in real time.
5. **Export:** Download crisp, production-ready images (PNG or SVG) formatted for stories, feeds, and presentations.

---

## Development Status

Graphixl is in its **early development stage**.

The foundational application shell, UI component system, build pipelines, and core dependencies (Satori, Resvg, Cheerio, Zod) are established and verified. Core domain services, including the Link Resolver API, Card Engine template registry, and Studio interface, are currently in active design and implementation.

For detailed information on subsystem boundaries and the implementation roadmap, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Planned Core Features

- **Link Resolver:**
  - Automated extraction of Open Graph, Twitter Cards, and standard HTML metadata.
  - Robust Server-Side Request Forgery (SSRF) mitigation and request timeouts.
  - Specialized adapters for platforms like GitHub, YouTube, and Substack.
- **Card Engine:**
  - Standardized, declarative card document schema validated with Zod.
  - Curated library of swappable card templates.
  - Multi-ratio rendering presets:
    - Square (`1:1`) for Instagram feeds and square posts.
    - Story / Reel (`9:16`) for Instagram Stories, TikTok, and mobile viewing.
    - Landscape (`16:9`) for video cards and presentations.
    - Social Share (`1.91:1`) for Open Graph cards and web previews.
  - High-fidelity SVG generation powered by Satori.
  - Crisp, deterministic PNG rasterization at high DPI via `@resvg/resvg-js`.
- **Studio Interface:**
  - Intuitive web-based workspace with real-time card previews.
  - Granular styling controls: typography, color schemes, padding, and accents.
  - One-click image download and clipboard export.
- **Self-Hosting Friendly:**
  - Fully open-source with no mandatory external SaaS dependencies.

---

## Product Goals & Design Principles

- **Simplicity:** High-quality visual cards generated in seconds without steep learning curves.
- **Visual Quality:** Pixel-perfect typography, balanced spacing, and refined color harmony out of the box.
- **Extensibility:** Modular architecture allowing new templates, extractors, and export formats to be added cleanly.
- **Security & Privacy:** Defensive HTTP client handling, strict anti-SSRF protections, and zero tracking.

---

## Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Components:** [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/) (Base UI + Nova preset), [Lucide React](https://lucide.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://motion.dev/), [GSAP](https://gsap.com/)
- **Card Rendering:** [Satori](https://github.com/vercel/satori), [Resvg](https://github.com/yisibl/resvg-js) (`@resvg/resvg-js`)
- **Metadata Extraction:** [Cheerio](https://cheerio.js.org/), [Zod](https://zod.dev/)
- **Tooling & Language:** [TypeScript 5](https://www.typescriptlang.org/), [ESLint 9](https://eslint.org/), [pnpm](https://pnpm.io/)

---

## Prerequisites

Ensure your local development environment meets the following requirements:

- **Node.js:** `>= 22` (v22 LTS recommended; see `.nvmrc`)
- **pnpm:** `>= 11.15.1`

If you use `nvm`, switch to the compatible Node.js version with:

```bash
nvm use
```

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aldevvv/graphixl.git
   cd graphixl
   ```

2. **Install dependencies:**

   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Start the local development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Starts the Next.js development server with Turbopack. |
| `pnpm build` | Compiles the production build. |
| `pnpm start` | Runs the compiled production server. |
| `pnpm lint` | Runs ESLint to validate code quality. |
| `pnpm typecheck` | Generates Next.js route types and runs TypeScript type checking (`next typegen && tsc --noEmit`). |
| `pnpm verify` | Executes `lint`, `typecheck`, and `build` in sequence. |
| `pnpm audit --prod` | Checks production dependencies for known vulnerabilities. |

---

## Architecture Overview

Graphixl is organized around four modular subsystems:

- **Link Resolver:** Handles URL validation, SSRF mitigation, and metadata extraction.
- **Card Engine:** Transforms card document schemas into SVG and high-resolution PNGs via Satori and Resvg.
- **Studio:** Interactive client interface for URL submission, live previews, and customization.
- **Shared Infrastructure:** Common validation schemas, error handling types, and utility functions.

For an in-depth breakdown of module responsibilities and data flow, consult the [Architecture Documentation](docs/ARCHITECTURE.md).

---

## Contributing

Contributions from the open-source community are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code style, branching strategy, and pull request workflow.

---

## Security

For vulnerability reporting procedures and security guidelines, please review [SECURITY.md](SECURITY.md). Please do not report security issues via public GitHub issues.

---

## License

This project is licensed under the [MIT License](LICENSE). Copyright &copy; 2026 aldevvv.
