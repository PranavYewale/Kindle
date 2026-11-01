# 🔥 Kindle — Autonomous Milestone Event Planning Engine

[![CI & Quality Assurance](https://github.com/PranavYewale/Kindle/actions/workflows/ci.yml/badge.svg)](https://github.com/PranavYewale/Kindle/actions/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/Tests-46%20Passed-emerald.svg)](https://github.com/PranavYewale/Kindle)
[![Test Coverage](https://img.shields.io/badge/Coverage-v8%20Verified-blue.svg)](https://github.com/PranavYewale/Kindle)
[![Security Audited](https://img.shields.io/badge/Security-OWASP%20Compliant-green.svg)](SECURITY.md)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployment-Vercel%20Edge-black.svg)](https://kindle-beryl.vercel.app/)

> **Live Production URL:** [https://kindle-beryl.vercel.app/](https://kindle-beryl.vercel.app/)  
> **Demo Walkthrough Video:** Available in project submission dossier

Kindle is an intelligent, autonomous event coordination engine designed to handle the complexity, cultural nuances, and logistical chaos of large-scale celebrations (multi-day Indian weddings, jubilee birthdays, festivals, and reunions).

---

## 🌟 Key Features

1. **4-Chapter Genesis Engine (Event Wizard)**
   - Customizes plans across 5 celebration archetypes (Royal Weddings, Milestone Birthdays, Community Melas, Anniversaries, Family Reunions).
   - Generates an 84-task dated timeline, itemized budget allocations, and cultural ritual schedules.

2. **Interactive Key Milestone Roadmap & Dynamic Cascade Engine**
   - Click-to-edit milestone targets with dynamic quick-shift nudges (`-3d`, `+3d`, `+1w`).
   - Automated milestone synchronization: locking major vendor decisions (Venue, Catering, Decor) automatically marks milestones as complete and cascades timeline dependencies.

3. **Ask Kindle AI (Real-time Copilot)**
   - Context-aware streaming assistant backed by Groq (LLaMA 3.3 70B Versatile), Google Gemini 1.5 Pro, and OpenAI fallback.
   - Dynamic budget reallocation and instant schedule delay simulation.

4. **Quote Cruncher (Invoice & Negotiation Intelligence)**
   - Line-item invoice parsing with hidden surcharge detection (overtime fees, platform surcharges).
   - Instant generation of localized WhatsApp negotiation scripts.

5. **Murphy Mode (Predictive Risk Simulation)**
   - Simulates weather events, power outages, and curfew rules with costed Plan B contingency protocols.

6. **Accessibility & Design System**
   - Dual-theme OKLCH color system (Obsidian Midnight Dark Mode & Warm Cream Light Mode).
   - WCAG 2.1 AA accessible with full keyboard navigation and screen-reader `aria-label` compliance.

---

## 🛠️ Tech Stack

- **Framework**: TanStack Start (React 19 + TypeScript)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **AI Inference Engine**: Groq Cloud (LLaMA 3.3 70B Versatile), Google Gemini 1.5 Pro, OpenRouter / GPT-4o-mini
- **Testing & Quality**: Vitest 4, v8 Coverage, ESLint 9, Prettier
- **Security**: Strict OWASP headers in `vercel.json` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **Deployment**: Vercel Serverless Edge Runtime

---

## 🧪 Testing & Verification

Kindle includes a comprehensive automated test suite verifying routing, state calculations, GenAI services, and accessibility compliance.

```bash
# Run unit & integration tests
npm test

# Run tests with code coverage report
npm run test:coverage

# Run ESLint quality audit
npm run lint

# Run TypeScript strict typecheck
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 🔒 Security & Data Privacy

Kindle follows strict security protocols:
- Zero raw API keys or production secrets exposed to the client bundle.
- Serverless edge runtime isolation for all GenAI invocations.
- OWASP security headers enforced via `vercel.json`.
- Comprehensive vulnerability policy documented in [SECURITY.md](SECURITY.md).
