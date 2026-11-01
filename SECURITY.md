# Security Policy

Kindle takes the security of its event intelligence architecture, real-time synchronization pipelines, and user privacy very seriously.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Kindle, please report it privately:

1. **Email**: Open an issue or contact `security@kindle-events.app`.
2. **Details**: Include a detailed description of the potential vulnerability, steps to reproduce, and attack surface.
3. **Response Time**: We acknowledge reports within 24 hours and issue patches within 72 hours.

## Security Controls Implemented

- **Enterprise OWASP HTTP Headers**: HSTS, Content-Security-Policy (CSP), X-Frame-Options (DENY), and X-Content-Type-Options (nosniff) configured in `vercel.json`.
- **Zero Client-Side Secret Leakage**: All GenAI service invocations run through server-side Nitro endpoints and encrypted edge environment variables (`process.env`).
- **Input Sanitization**: All user story prompts and vendor invoice payloads are strictly validated using Zod schemas and character limits before LLM synthesis.
- **Automated CI/CD Scanning**: Every pull request undergoes automated static analysis, TypeScript strict checking, dependency auditing, and unit test verification.
