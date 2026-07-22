# SecureBot - Technology Stack Visual Guide

## Complete Technology Landscape

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                    🔐 SECUREBOT TECHNOLOGY STACK 🔐                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Frontend Application

```
┌────────────────────────────────────────────────────────┐
│              FRONTEND LAYER (Client-Side)              │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   React 18   │  │ TypeScript   │  │ Tailwind   │  │
│  │              │  │   5.5.3      │  │ CSS 3.4.1  │  │
│  │ (UI Library) │  │ (Type Safe)  │  │(Styling)   │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Lucide      │  │   Vite       │  │ PostCSS    │  │
│  │  React       │  │   5.4.2      │  │ 8.4.35     │  │
│  │ (Icons)      │  │(Build Tool)  │  │(CSS Tools) │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
│                                                         │
│  📦 Total: 26 TypeScript files (9 .ts + 17 .tsx)    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Layer 2: State & Logic Management

```
┌────────────────────────────────────────────────────────┐
│            LOGIC & STATE LAYER (TypeScript)            │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Analysis Engine                                        │
│  ├─ SecurityAnalyzer (Pattern Detection)              │
│  ├─ CodeQLService (Semantic Analysis)                 │
│  └─ CodeQLAdapter (Format Transformation)             │
│                                                         │
│  Utilities & Services                                  │
│  ├─ CodeFixer (Automated Fixes)                       │
│  ├─ VulnerabilityPatterns (Regex Definitions)         │
│  ├─ GitHubApi (Repository Integration)                │
│  └─ GoogleAuth (OAuth Integration)                    │
│                                                         │
│  Types System                                          │
│  └─ security.ts (TypeScript Interfaces)               │
│                                                         │
│  📊 Patterns: 10+ regex-based detectors                │
│  📚 Queries: 10+ CodeQL security queries               │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Layer 3: Analysis Engines

```
┌────────────────────────────────────────────────────────┐
│           ANALYSIS & DETECTION LAYER                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ PATTERN-BASED ANALYSIS (JavaScript/TypeScript) │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Language: Regex (ECMAScript)                    │  │
│  │ Speed: ⚡ Very Fast (< 1s)                     │  │
│  │ Accuracy: ⚠️ Medium (false positives)          │  │
│  │ Setup: ✅ None required                        │  │
│  │                                                  │  │
│  │ Detects:                                        │  │
│  │ • SQL Injection (CWE-89)                       │  │
│  │ • XSS (CWE-79)                                 │  │
│  │ • Command Injection (CWE-78)                   │  │
│  │ • Code Injection (CWE-94)                      │  │
│  │ • Hardcoded Credentials (CWE-798)              │  │
│  │ • + 5 more vulnerability types                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ CODEQL ANALYSIS (10+ Languages)                 │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Language: QL (CodeQL Query Language)            │  │
│  │ Speed: 🐢 Slower (10-60s)                      │  │
│  │ Accuracy: ✅ High (semantic)                    │  │
│  │ Setup: ⚙️ Backend required                     │  │
│  │                                                  │  │
│  │ Supported Languages:                            │  │
│  │ • JavaScript/TypeScript                         │  │
│  │ • Python                                        │  │
│  │ • Java/Kotlin                                   │  │
│  │ • Go                                            │  │
│  │ • C/C++                                         │  │
│  │ • C#                                            │  │
│  │ • Ruby                                          │  │
│  │ • PHP                                           │  │
│  │ • Swift                                         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ HYBRID MODE (Pattern + CodeQL)                  │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Combines both approaches                        │  │
│  │ Deduplicates results                            │  │
│  │ Maximum coverage and accuracy                   │  │
│  │ Fallback to patterns if CodeQL unavailable      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Layer 4: API & Integration

```
┌────────────────────────────────────────────────────────┐
│          EXTERNAL INTEGRATIONS LAYER                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  GitHub API      │  │  Google OAuth    │           │
│  │                  │  │                  │           │
│  │ • Fetch repos    │  │ • User auth      │           │
│  │ • List files     │  │ • ID tokens      │           │
│  │ • Read code      │  │ • Credentials    │           │
│  │ • Create PRs     │  │ • Profile data   │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Supabase        │  │  CodeQL CLI      │           │
│  │                  │  │                  │           │
│  │ • Database       │  │ • Database setup │           │
│  │ • Edge Functions │  │ • Query exec     │           │
│  │ • Auth users     │  │ • SARIF output   │           │
│  │ • Row security   │  │ • Result parse   │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
                         🖥️ USER BROWSER
                              │
                              │ Paste Code
                              ▼
                    ┌──────────────────────┐
                    │   CodeInput (TSX)    │
                    │  TypeScript Handler  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   App Component      │
                    │  State Management    │
                    └──────────┬───────────┘
                               │
                  ┌────────────┼────────────┐
                  │                        │
                  ▼                        ▼
         ┌──────────────────┐   ┌──────────────────┐
         │  Pattern-Based   │   │     CodeQL       │
         │   Analyzer       │   │   Service        │
         │  (TypeScript)    │   │  (TypeScript)    │
         └────────┬─────────┘   └────────┬─────────┘
                  │                      │
                  │ Regex Match          │ API Call
                  │                      │
                  │                      ▼
                  │            ┌──────────────────┐
                  │            │ Supabase Edge    │
                  │            │ Function (Deno)  │
                  │            │ TypeScript       │
                  │            └────────┬─────────┘
                  │                     │
                  │                     │ Execute
                  │                     │
                  │                     ▼
                  │            ┌──────────────────┐
                  │            │  CodeQL CLI      │
                  │            │  (External)      │
                  │            │ QL Language      │
                  │            └────────┬─────────┘
                  │                     │
                  │                     │ SARIF
                  │                     │ Output
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌──────────────────────┐
                    │   CodeQL Adapter     │
                    │  (TypeScript)        │
                    │  Transform SARIF     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  AnalysisResult      │
                    │  (TypeScript Type)   │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  │                        │
                  ▼                        ▼
         ┌──────────────────┐   ┌──────────────────┐
         │ ResultsDisplay   │   │ VulnerabilityChart
         │ (TSX Component)  │   │ (TSX Component)
         └──────────────────┘   └──────────────────┘
```

---

## Language Distribution Diagram

```
PROJECT FILE COMPOSITION
═══════════════════════════════════════════════════════════

TypeScript + TSX ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░ 71% (26 files)
│
├─ TSX Components ▓▓▓▓▓▓▓▓▓▓▓░░░ 46% (17 components)
└─ TypeScript Core ▓▓▓▓▓░░░░░░░░░ 25% (9 logic files)

JSON Configuration ▓▓▓▓▓░░░░░░░░░░░░░░░░ 14% (5+ files)
JavaScript Config ▓▓▓░░░░░░░░░░░░░░░░░░ 8%  (3 files)
Markdown Docs     ▓▓▓░░░░░░░░░░░░░░░░░░ 11% (4 files)
CSS Styling       ▓░░░░░░░░░░░░░░░░░░░░ 3%  (1 file)
HTML Markup       ▓░░░░░░░░░░░░░░░░░░░░ 3%  (1 file)

TOTAL: 45+ files  ~8,700 lines of code
```

---

## Component & Module Map

```
📦 SRC DIRECTORY STRUCTURE
═════════════════════════════════════════════════════════

src/
├── 📁 components/          [17 TSX files - UI Layer]
│   ├── 🎨 App.tsx          [Root component, state mgmt]
│   ├── 📝 CodeInput.tsx     [Code editor]
│   ├── 📊 ResultsDisplay.tsx [Results viewer]
│   ├── 🔧 CodeFixer.tsx     [Fix generator]
│   ├── 🔐 LoginPage.tsx     [Auth UI]
│   ├── 👤 UserProfile.tsx   [User dropdown]
│   ├── 🌐 GitHubIntegration.tsx [GitHub sync]
│   ├── 📈 SecurityMetrics.tsx [Dashboard]
│   ├── 📉 VulnerabilityChart.tsx [Charts]
│   ├── 💻 InteractiveCodeBlock.tsx [Code display]
│   ├── ℹ️ CodeQLInfo.tsx    [Mode info]
│   ├── 📚 ExampleCode.tsx   [Examples]
│   ├── ⚡ AutoExamples.tsx  [Auto loader]
│   ├── 🌌 AnimatedBackground.tsx [Animation]
│   ├── ⏳ LoadingSpinner.tsx [Loading]
│   ├── 🏷️ SecurityBadge.tsx  [Badges]
│   └── [more components...]
│
├── 📁 utils/               [9 TS files - Logic Layer]
│   ├── 🛡️ securityAnalyzer.ts [Main engine]
│   ├── 🔬 codeqlService.ts [CodeQL API]
│   ├── 🔄 codeqlAdapter.ts [Data transform]
│   ├── 🔧 codeFixer.ts     [Fix generation]
│   ├── 🎯 vulnerabilityPatterns.ts [Patterns]
│   ├── 🌐 githubApi.ts     [GitHub API]
│   ├── 🔐 googleAuth.ts    [Google OAuth]
│   └── [more utilities...]
│
├── 📁 types/               [Type Definitions]
│   └── 🔍 security.ts      [TypeScript interfaces]
│
├── 🎨 index.css            [Global styles (CSS)]
├── 🚀 main.tsx             [Entry point (TSX)]
└── 🌍 vite-env.d.ts        [Vite types]

ROOT
├── 📄 index.html           [HTML entry]
├── ⚙️ vite.config.ts       [Vite config (TS)]
├── 🔧 postcss.config.js    [PostCSS config (JS)]
├── 🎨 tailwind.config.js   [Tailwind config (JS)]
├── 📋 eslint.config.js     [ESLint config (JS)]
├── 📦 package.json         [Dependencies (JSON)]
├── ⚡ tsconfig.json        [TS config (JSON)]
├── 📖 README.md            [Overview (Markdown)]
├── 🔐 CODEQL_SETUP.md      [CodeQL guide (Markdown)]
└── 📚 PROJECT_DOCUMENTATION.md [Full docs (Markdown)]
```

---

## Technology Decision Matrix

```
┌──────────────────┬────────────────┬──────────────┬─────────────┐
│   Technology     │   Why Chosen   │  Main Purpose │ Alternative │
├──────────────────┼────────────────┼──────────────┼─────────────┤
│ React 18         │ Component UI   │ UI rendering │ Vue, Svelte │
│ TypeScript       │ Type safety    │ Code quality │ Flow, None  │
│ Vite             │ Fast builds    │ Dev experience│ Webpack     │
│ Tailwind CSS     │ Rapid styling  │ Styling      │ Bootstrap   │
│ Lucide Icons     │ SVG icons      │ UI elements  │ FontAwesome │
│ CodeQL           │ Semantic AI    │ Analysis     │ SonarQube   │
│ Regex            │ Pattern match  │ Detection    │ Tokenizers  │
│ Supabase         │ Backend ready  │ Database     │ Firebase    │
│ GitHub API       │ Integrations   │ Git repos    │ GitLab API  │
│ Deno             │ Serverless     │ Edge compute │ Node.js     │
└──────────────────┴────────────────┴──────────────┴─────────────┘
```

---

## Runtime Environment

```
🖥️  DEVELOPMENT ENVIRONMENT
═════════════════════════════════════════

Browser                    Development Tools
├─ React Runtime          ├─ Vite Dev Server (HMR)
├─ TypeScript (compiled)  ├─ ESLint (linting)
├─ JavaScript Engine      ├─ TypeScript Compiler
├─ DOM API                ├─ PostCSS Processor
└─ Web APIs               └─ Tailwind CLI

                Package Manager
                └─ NPM 10+


🌐 PRODUCTION ENVIRONMENT
═════════════════════════════════════════

Browser                    CDN / Hosting
├─ Minified JS            ├─ Vite build output
├─ Optimized CSS          ├─ HTML5
├─ Lazy loading           ├─ Assets
└─ Service Workers        └─ Cache strategy


☁️  BACKEND (Optional - CodeQL)
═════════════════════════════════════════

Supabase Edge Functions    External Services
├─ Deno Runtime          ├─ CodeQL CLI
├─ TypeScript Support    ├─ Database (Postgres)
├─ Native Fetch API      └─ File I/O
└─ Subprocess Execution
```

---

## Build Pipeline

```
SOURCE CODE
    │
    ├─ TypeScript Files (.ts, .tsx)
    ├─ CSS Files (.css)
    └─ JSON Configs
    │
    ▼
VITE BUILD PROCESS
    │
    ├─ TypeScript Compiler
    │   └─ Converts TS/TSX → JS
    │
    ├─ React Transformation
    │   └─ JSX → React.createElement()
    │
    ├─ Tailwind CSS
    │   ├─ PostCSS Processing
    │   ├─ PurgeCSS (unused removal)
    │   └─ Autoprefixer
    │
    └─ Bundling & Minification
        ├─ Tree shaking
        ├─ Code splitting
        └─ Minification
    │
    ▼
PRODUCTION BUILD (dist/)
    │
    ├─ HTML (0.48 kB)
    ├─ CSS (33.30 kB → 5.90 kB gzip)
    └─ JavaScript (242.88 kB → 71.31 kB gzip)
    │
    ▼
DEPLOYMENT
    │
    ├─ Vercel
    ├─ Netlify
    ├─ AWS S3 + CloudFront
    └─ Other Static Hosts
```

---

## Dependency Graph

```
CORE DEPENDENCIES
═══════════════════════════════════════════════

┌─────────────────────────────────────────┐
│          NPM PACKAGES (16)              │
├─────────────────────────────────────────┤
│                                          │
│  Runtime Dependencies                   │
│  ├─ react@18.3.1                       │
│  ├─ react-dom@18.3.1                   │
│  ├─ lucide-react@0.344.0                │
│  ├─ @supabase/supabase-js@2.57.4        │
│  ├─ @octokit/rest@22.0.0                │
│  ├─ googleapis@160.0.0                  │
│  └─ @google-cloud/local-auth@3.0.1      │
│                                          │
│  Dev Dependencies                       │
│  ├─ typescript@5.5.3                    │
│  ├─ vite@5.4.2                          │
│  ├─ react@18.3.1 (peer)                │
│  ├─ tailwindcss@3.4.1                   │
│  ├─ postcss@8.4.35                      │
│  ├─ autoprefixer@10.4.18                │
│  ├─ eslint@9.9.1                        │
│  └─ ... (9 more dev deps)               │
│                                          │
│  Plugin Dependencies                    │
│  ├─ @vitejs/plugin-react@4.3.1          │
│  ├─ @eslint/js@9.9.1                    │
│  ├─ typescript-eslint@8.3.0              │
│  └─ eslint-plugin-react-*               │
│                                          │
└─────────────────────────────────────────┘
```

---

## Multi-Language Feature Support

```
VULNERABILITY TYPES → DETECTION LANGUAGES
═══════════════════════════════════════════════════════════

SQL Injection (CWE-89)
├─ Pattern: ✅ Regex
├─ CodeQL: ✅ JavaScript/TypeScript/Python/Java/Go/C++
└─ Hybrid: ✅✅ Both

Cross-Site Scripting (CWE-79)
├─ Pattern: ✅ Regex
├─ CodeQL: ✅ JavaScript/TypeScript/Python/Ruby
└─ Hybrid: ✅✅ Both

Command Injection (CWE-78)
├─ Pattern: ✅ Regex
├─ CodeQL: ✅ JavaScript/TypeScript/Python/Java/Ruby/Go
└─ Hybrid: ✅✅ Both

Code Injection (CWE-94)
├─ Pattern: ✅ Regex
├─ CodeQL: ✅ All supported languages
└─ Hybrid: ✅✅ Both

Hardcoded Credentials (CWE-798)
├─ Pattern: ✅ Regex
├─ CodeQL: ✅ All supported languages
└─ Hybrid: ✅✅ Both

... [+ 5 more vulnerability types]
```

---

## Compliance & Standards

```
STANDARDS & SPECIFICATIONS USED
═══════════════════════════════════════════

✅ SARIF 2.1.0 - Standard Analysis Results Format
   └─ Static Analysis Results Interchange Format
   └─ JSON-based vulnerability reporting

✅ CWE - Common Weakness Enumeration
   └─ Standardized vulnerability classification
   └─ 10+ CWE mappings in application

✅ HTML5 - Latest HTML standard
   └─ Semantic markup
   └─ Modern Web APIs

✅ CSS3 - Latest CSS standard
   └─ Flexbox, Grid, Animations
   └─ CSS Variables

✅ ECMAScript 2020 - JavaScript Standard
   └─ ES6+ features
   └─ Async/Await, Promises

✅ OAuth 2.0 - Authentication Standard
   └─ Google OAuth
   └─ GitHub OAuth

✅ REST - API Architecture
   └─ GitHub API integration
   └─ CodeQL backend calls
```

---

## File Size Metrics

```
PRODUCTION BUILD OUTPUT
════════════════════════════════════════════

HTML File
  └─ index.html: 0.48 kB (gzipped: 0.31 kB)

CSS Bundle
  └─ assets/index-*.css: 33.30 kB (gzipped: 5.90 kB)
     └─ Tailwind + Global styles
     └─ Automated prefix added

JavaScript Bundle
  └─ assets/index-*.js: 242.88 kB (gzipped: 71.31 kB)
     └─ React 18 runtime
     └─ All components & utilities
     └─ Source maps included

TOTAL SIZE
  └─ Uncompressed: 276.66 kB
  └─ Gzipped: 77.52 kB
  └─ Load time: ~500ms on 3G
  └─ Compression ratio: 72%
```

---

## Summary Matrix

| Category | Count | Languages |
|----------|-------|-----------|
| **Components** | 17 | TypeScript + React |
| **Utilities** | 9 | TypeScript |
| **Type Definitions** | 1 | TypeScript |
| **Configuration** | 7 | JavaScript + JSON |
| **Styling** | 1 | CSS + Tailwind |
| **Documentation** | 4 | Markdown |
| **HTML Entry** | 1 | HTML5 |
| **Total Files** | 40+ | 8+ Languages |

---

**SecureBot** is built as a **polyglot full-stack application** leveraging the best language for each specific purpose, from type-safe frontend development to semantic code analysis.

