# Security Policy

This document outlines the vulnerability reporting policy and security expectations for Graphixl.

## Supported Versions

Graphixl is currently in early development. Security updates are applied directly to the `main` branch.

| Branch | Supported |
| ------ | --------- |
| `main` | Yes       |

## Reporting a Vulnerability

Do not report security vulnerabilities through public GitHub issues or discussions.

Send vulnerability reports privately to the project maintainer by email:

- Contact: `mhdalif.id@gmail.com`
- Subject line: `[SECURITY] Graphixl Vulnerability Report`

If GitHub Private Vulnerability Reporting is enabled for the repository, reports may also be submitted through the repository Security tab.

### What to Include

Please provide:

- A description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal proof of concept.
- The affected file, component, or configuration.
- Any suggested remediations or patches.

### Response Process

The maintainer will review reports on a best-effort basis, investigate confirmed issues, and coordinate any necessary fixes directly on the `main` branch before public release notes are published.

## Planned Security Requirements for URL Retrieval

Graphixl is designed to process external URLs to extract metadata. Core networking features are currently in development. Future implementations of the Link Resolver must satisfy the following security requirements:

- **Server-Side Request Forgery (SSRF) Defense:** URL schemes must be restricted strictly to `http:` and `https:`. Outbound requests to loopback addresses, link-local addresses, private subnets (RFC 1918, RFC 4193), and cloud metadata endpoints (such as `169.254.169.254`) must be blocked at both the DNS resolution and HTTP transport layers.
- **Resource Limits:** Implement explicit response size limits, request timeouts, and maximum redirect counts to mitigate denial of service and decompression attacks.
- **Content Sanitization:** Extracted metadata must be sanitized before rendering into DOM or SVG contexts to prevent script injection.

## Dependency Security Posture

- **Production Dependencies:** Production dependencies are audited using `pnpm audit --prod` as a required check in the continuous integration pipeline.
- **Overrides:** Dependency overrides are declared in `pnpm-workspace.yaml` where necessary, such as pinning `fflate` for Satori dependencies to mitigate upstream vulnerabilities.
- **Development Tooling Advisory:** The known `braces` advisory currently affects the development dependency tree through ESLint tooling (`eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch > braces`). It is not present in the audited production dependency tree. The advisory remains under review pending an upstream fix.
