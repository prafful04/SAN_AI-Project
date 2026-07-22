# SecureBot - Languages Quick Reference Guide

## All Languages Used - At a Glance

### Primary Languages

```
1. TypeScript (.ts)           → 9 files       [Core Logic & Utilities]
2. TypeScript + React (.tsx)  → 17 files      [UI Components]
3. JavaScript (.js)           → 3 files       [Configuration]
4. CSS (.css)                 → 1 file        [Global Styles]
5. HTML (.html)               → 1 file        [Entry Point]
6. JSON                       → 5+ files      [Config & Data]
7. Markdown (.md)             → 4 files       [Documentation]
```

---

## File Breakdown by Language

### TypeScript Files (9 files - Core Logic)

```
src/utils/
├── securityAnalyzer.ts        [Main analysis engine]
├── codeqlService.ts           [CodeQL API integration]
├── codeqlAdapter.ts           [Data transformation]
├── codeFixer.ts               [Automated fix generation]
├── vulnerabilityPatterns.ts   [Pattern definitions]
├── githubApi.ts               [GitHub API wrapper]
└── googleAuth.ts              [Google OAuth handler]

src/types/
└── security.ts                [TypeScript type definitions]

Root/
└── vite.config.ts             [Build configuration]
```

### TSX Files (17 files - React Components)

```
src/components/
├── App.tsx                    [Root component, state management]
├── CodeInput.tsx              [Code editor interface]
├── ResultsDisplay.tsx         [Analysis results viewer]
├── CodeFixer.tsx              [Automated fix UI]
├── LoginPage.tsx              [Authentication UI]
├── UserProfile.tsx            [User profile dropdown]
├── GitHubIntegration.tsx      [GitHub repo integration]
├── SecurityMetrics.tsx        [Metrics dashboard]
├── VulnerabilityChart.tsx     [Visualization charts]
├── InteractiveCodeBlock.tsx   [Code display with highlighting]
├── CodeQLInfo.tsx             [Mode information display]
├── ExampleCode.tsx            [Example loader]
├── AutoExamples.tsx           [Auto-running examples]
├── AnimatedBackground.tsx     [Animated gradient]
├── LoadingSpinner.tsx         [Loading indicator]
├── SecurityBadge.tsx          [Severity badges]
└── [more components...]

Root/
└── src/main.tsx               [Application entry point]
```

### JavaScript Configuration Files (3 files)

```
Root/
├── postcss.config.js          [CSS post-processing]
├── tailwind.config.js         [Tailwind CSS setup]
└── eslint.config.js           [Linting rules]
```

### Styling

```
src/
└── index.css                  [Global CSS + Tailwind imports]
```

### Markup

```
Root/
└── index.html                 [HTML5 entry point]
```

### JSON Files (5+)

```
Root/
├── package.json               [Dependencies & scripts]
├── tsconfig.json              [TypeScript config]
├── tsconfig.app.json          [App TS config]
├── tsconfig.node.json         [Node TS config]
├── .env.example               [Environment template]
└── .env                       [Environment variables]
```

### Markdown Documentation (4 files)

```
Root/
├── README.md                  [Project overview]
├── CODEQL_SETUP.md           [CodeQL setup guide]
├── PROJECT_DOCUMENTATION.md   [Full documentation]
└── LANGUAGES_AND_TECHNOLOGIES.md [Technology guide]
```

---

## Language Statistics

### File Count Distribution
```
TypeScript + TSX (26 files) ... 71%
├─ TypeScript: 9
├─ TSX: 17
│
JSON (5+ files) ............... 14%
JavaScript (3 files) ......... 8%
Markdown (4 files) ........... 11%
CSS (1 file) ................. 3%
HTML (1 file) ................ 3%
```

### Lines of Code (Estimated)

| Language | Files | Approx LOC |
|----------|-------|-----------|
| TypeScript | 9 | ~2,500 |
| TSX | 17 | ~3,500 |
| CSS | 1 | ~200 |
| JSON | 5+ | ~500 |
| Markdown | 4 | ~2,000 |
| **Total** | **36+** | **~8,700** |

---

## Quick Reference Guide

### When to Use Each Language in SecureBot

#### TypeScript (.ts)
**Use For**: Business logic, utilities, services
```typescript
// Example: Analysis Engine
export class SecurityAnalyzer {
  async analyze(code: string): Promise<AnalysisResult> {
    // Implementation
  }
}
```

#### TSX
**Use For**: React UI components
```typescript
// Example: UI Component
export function ResultsDisplay(props: ResultsDisplayProps) {
  return <div>{/* JSX */}</div>;
}
```

#### JavaScript (.js)
**Use For**: Build and tool configuration
```javascript
// Example: Build Config
export default {
  plugins: [tailwindcss],
};
```

#### CSS
**Use For**: Global styles and animations
```css
/* Example: Global Animation */
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

#### JSON
**Use For**: Configuration and package metadata
```json
{
  "name": "securebot",
  "version": "1.0.0"
}
```

#### Markdown
**Use For**: Documentation and guides
```markdown
# SecureBot Setup Guide
Instructions for getting started...
```

---

## Language Roles & Responsibilities

### Analysis Languages

#### 1. Pattern Matching
- **Language**: Regular Expressions (in TypeScript)
- **Purpose**: Fast vulnerability detection
- **Complexity**: Low-Medium
- **Speed**: Very Fast (< 1 second)

#### 2. CodeQL Queries
- **Language**: QL (CodeQL Query Language)
- **Purpose**: Semantic vulnerability detection
- **Complexity**: High
- **Speed**: Slower (10-60 seconds)

#### 3. SARIF Format
- **Language**: JSON (SARIF 2.1.0 standard)
- **Purpose**: Standardized output format
- **Complexity**: Low
- **Speed**: Immediate

---

## API & Integration Languages

### GitHub API Integration
- **Language**: TypeScript
- **Protocol**: REST (HTTP/HTTPS)
- **Format**: JSON responses
- **Authentication**: OAuth 2.0

### Google OAuth
- **Language**: TypeScript + Web APIs
- **Protocol**: OAuth 2.0
- **Format**: JWT tokens
- **Authentication**: ID tokens

### Supabase Integration
- **Language**: TypeScript (@supabase/supabase-js library)
- **Protocol**: HTTP/WebSocket
- **Format**: JSON
- **Authentication**: JWT + RLS policies

### CodeQL Backend
- **Language**: Deno TypeScript (Edge Functions)
- **Protocol**: HTTP/REST
- **Format**: JSON (SARIF input/output)
- **Execution**: Serverless

---

## Code Organization by Language

### TypeScript Modules

```typescript
// Module Structure
import { SecurityAnalyzer } from './utils/securityAnalyzer';
import { CodeQLService } from './utils/codeqlService';
import type { AnalysisResult } from './types/security';

// Usage
const analyzer = new SecurityAnalyzer();
const result = await analyzer.analyze(code);
```

### React Component Structure

```typescript
// Component Structure
import React, { useState, useCallback } from 'react';
import { Icon } from 'lucide-react';

interface ComponentProps {
  data: string;
  onAction: () => void;
}

export function Component({ data, onAction }: ComponentProps) {
  const [state, setState] = useState(false);

  return <div>{/* JSX */}</div>;
}
```

### Type Definitions

```typescript
// Type System
interface Finding {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

type AnalysisMode = 'pattern' | 'codeql' | 'hybrid';

class SecurityAnalyzer {
  // Implementation
}
```

---

## Supported Code Analysis

### Pattern-Based Detection
**Supports**: JavaScript, TypeScript (via Regex)

```javascript
// Vulnerable: SQL Injection
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// Pattern: /\.query\s*\(\s*[`'"].*\$\{.*\}.*[`'"]\s*\)/g
```

### CodeQL Analysis
**Supports**: JavaScript, Python, Java, Go, C/C++, C#, Ruby, PHP, Swift, Kotlin

```ql
// CodeQL Query Example
import javascript
from DataFlow::Node source, DataFlow::Node sink
where source instanceof Source and sink instanceof Sink
select source, sink
```

---

## Development Workflow by Language

### TypeScript Development
```bash
# Type checking
npm run typecheck

# Compile to JavaScript
tsc --noEmit

# Development server
npm run dev
```

### CSS Development
```bash
# Tailwind CSS compilation
npm run build

# PostCSS processing
npx postcss src/index.css -o dist/index.css
```

### Documentation
```markdown
# Write in Markdown
- Use GitHub Flavored Markdown
- Add code blocks with syntax highlighting
- Include tables and diagrams
```

---

## Technology Evolution

### Current Stack
```
React 18 + TypeScript 5.5 + Vite 5.4 + Tailwind CSS 3.4
```

### Compatible Future Additions
- **Python**: `python/3.11+` (analysis scripts)
- **Rust**: For performance-critical modules
- **GraphQL**: For Supabase advanced queries
- **SQL**: Direct database queries
- **YAML**: CI/CD configuration
- **Docker**: Container deployment

---

## Performance by Language

| Language | Task | Speed | Memory |
|----------|------|-------|--------|
| JavaScript/TypeScript | UI Rendering | Fast | Medium |
| CSS (Tailwind) | Styling | Very Fast | Low |
| Regex (Pattern) | Vulnerability Detection | Very Fast | Low |
| CodeQL (QL) | Semantic Analysis | Slow | High |
| JSON | Data Serialization | Fast | Low |

---

## Security Considerations by Language

### TypeScript
- ✅ Prevents type-related security issues
- ✅ Null/undefined checks
- ✅ Interface validation

### Regex
- ⚠️ Can have false positives
- ⚠️ Pattern complexity must be monitored
- ✅ No execution of matched code

### CodeQL
- ✅ Enterprise-grade security analysis
- ✅ Accurate data flow tracking
- ⚠️ Requires trusted setup

### JSON
- ✅ No code execution
- ✅ Immutable data format
- ✅ Standard parsing

---

## Summary

**SecureBot** uses a **polyglot architecture** with languages optimized for different purposes:

1. **TypeScript/TSX** - Type-safe application logic
2. **CSS/HTML** - Modern responsive UI
3. **JavaScript** - Tool configuration
4. **Markdown** - Comprehensive documentation
5. **JSON** - Data configuration
6. **CodeQL** - Advanced security analysis (optional)
7. **Regex** - Pattern-based detection
8. **Deno** - Serverless backend (optional)

This diverse stack provides flexibility, security, and performance across all application layers.

