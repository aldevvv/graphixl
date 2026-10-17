# Security Policy

The Graphixl maintainers take the security of this project seriously. This document outlines our vulnerability reporting policy and guidelines for responsible disclosure.

## Supported Versions

Graphixl is currently in active early development. Security updates are applied to the `main` branch.

| Branch | Supported          |
| ------ | ------------------ |
| `main` | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues or public discussions.**

If you discover a security vulnerability in Graphixl, please disclose it privately using one of the following methods:

1. **GitHub Private Vulnerability Reporting:** Submit a report via the [Security tab](https://github.com/aldevvv/graphixl/security/advisories/new) of the repository if private vulnerability reporting is enabled.
2. **Direct Contact:** If GitHub Private Vulnerability Reporting is unavailable, email the maintainer privately at `mhdalif.id@gmail.com` with the subject line `[SECURITY] Graphixl Vulnerability Report`.

### What to Include in Your Report

To help us assess and resolve the issue quickly, please provide:

- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal proof of concept (PoC).
- The affected component, file, or endpoint.
- Any suggested mitigations or patches, if available.

### Response Process

- We will acknowledge receipt of your report within 48 to 72 hours.
- We will investigate and validate the issue, keeping you informed of progress.
- Once a fix is verified, a patched release will be committed to `main`.
- Public disclosure will be coordinated responsibly after the fix is deployed.

## Security Considerations for Contributors

Graphixl processes untrusted URLs submitted by users to extract metadata and render images. When contributing, keep the following security boundaries in mind:

- **Server-Side Request Forgery (SSRF):** Any HTTP client fetching target URLs must validate input schemes (restricting to `http:` and `https:`) and strictly prohibit requests to loopback, link-local, private IP ranges (RFC 1918, RFC 4193), cloud metadata services, and internal infrastructure.
- **Resource Limits:** Implement strict response size caps, request timeouts, and redirect limits to protect against denial of service and decompression bombs.
- **Sanitization:** All extracted HTML metadata must be properly sanitized before rendering or storing to prevent Cross-Site Scripting (XSS).

## Dependency Security Posture

Graphixl strictly verifies production dependencies to maintain zero known production vulnerabilities:

- Production dependencies are validated with `pnpm audit --prod` as a mandatory blocking gate in CI.
- Overrides are applied where necessary (e.g., `fflate` via `pnpm-workspace.yaml` for Satori dependencies) to resolve upstream vulnerabilities.
- **Known Development Advisory:** A stack-exhaustion denial of service advisory exists in `braces` (<=3.0.3), transitive within `eslint-config-next` / `@next/eslint-plugin-next`. This dependency is strictly used during local linting and CI analysis, is excluded from production builds and runtime artifacts, and does not impact application security.
