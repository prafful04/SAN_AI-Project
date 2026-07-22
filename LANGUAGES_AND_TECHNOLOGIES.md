# SecureBot - Languages & Technologies Used

## Complete Technology Stack Overview

---

## Primary Languages

### 1. TypeScript
**Version**: 5.5.3

**Usage**: Primary programming language for the entire application

**Files Using TypeScript**:
- All `.ts` and `.tsx` files in `src/`
- Configuration files: `vite.config.ts`, `tsconfig.*.ts`

**TypeScript Files Count**: 24+ files

**Key TypeScript Features Used**:
- **Interfaces**: Type definitions for components, utilities, and API responses
- **Generics**: Used in analyzer for flexible type handling
- **Union Types**: Analysis modes ('pattern' | 'codeql' | 'hybrid')
- **Enums**: Severity levels (Critical, High, Medium, Low)
- **Classes**: SecurityAnalyzer, CodeQLService, CodeQLAdapter
- **Async/Await**: Asynchronous API calls
- **Type Guards**: Null/undefined checks
- **Decorators**: Potential for future enhancements

**Example - Type Definitions**:
```typescript
// From src/types/security.ts
interface AnalysisResult {
  scan_id: string;
  timestamp: string;
  file_name: string;
  language: string;
  findings: Finding[];
  summary: {
    total_issues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    risk_score: number;
  };
}

type AnalysisMode = 'pattern' | 'codeql' | 'hybrid';

class SecurityAnalyzer {
  async analyze(code: string, fileName: string): Promise<AnalysisResult> {
    // Implementation
  }
}
```

**Why TypeScript**:
- Type safety prevents runtime errors
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring
- Improved maintainability

---

### 2. JavaScript (ES2020+)
**Standard**: ECMAScript 2020

**Usage**: Fallback and configuration files

**Files Using JavaScript**:
- `postcss.config.js`
- `tailwind.config.js`
- `eslint.config.js`

**JavaScript Features Used**:
- ES6 Modules (import/export)
- Arrow Functions
- Destructuring
- Spread Operator
- Template Literals
- Promises & Async/Await
- Regular Expressions

**Example - JavaScript Config**:
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 3. TSX (TypeScript + JSX)
**Version**: React 18 JSX syntax

**Usage**: React component files

**Files Using TSX**: 20+ component files

**TSX Files**:
```
src/components/
├── App.tsx
├── CodeInput.tsx
├── ResultsDisplay.tsx
├── CodeFixer.tsx
├── LoginPage.tsx
├── UserProfile.tsx
├── GitHubIntegration.tsx
├── SecurityMetrics.tsx
├── VulnerabilityChart.tsx
├── InteractiveCodeBlock.tsx
├── CodeQLInfo.tsx
├── ExampleCode.tsx
├── AutoExamples.tsx
├── AnimatedBackground.tsx
├── LoadingSpinner.tsx
├── SecurityBadge.tsx
└── [others...]
```

**JSX/TSX Features Used**:
- Functional Components
- React Hooks (useState, useEffect, useCallback, useMemo)
- Props Interface Definitions
- Conditional Rendering
- Event Handlers
- Component Composition
- Higher-Order Components (HOC)

**Example - TSX Component**:
```typescript
// src/components/ResultsDisplay.tsx
interface ResultsDisplayProps {
  results: AnalysisResult;
  rawJson: string;
  showJson: boolean;
  onToggleJson: () => void;
}

export function ResultsDisplay({
  results,
  rawJson,
  showJson,
  onToggleJson
}: ResultsDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Analysis Results ({results.findings.length} issues)
      </h3>
      {/* Component JSX */}
    </div>
  );
}
```

---

## Frontend Languages

### 4. CSS (Cascading Style Sheets)
**Version**: CSS3

**Usage**: Styling

**Files**:
- `src/index.css` (Global styles)
- Component inline styles via Tailwind classes

**CSS Features Used**:
- CSS Variables (custom properties)
- Flexbox Layout
- Grid Layout
- Media Queries
- Animations
- Gradients
- Transitions

**Example - Global CSS**:
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

---

### 5. HTML
**Version**: HTML5

**Usage**: Markup and page structure

**Files**:
- `index.html` (Main HTML entry point)
- Inline JSX in TSX files

**HTML Features Used**:
- Semantic HTML5 elements
- Meta tags for SEO and viewport
- Script loading
- Noscript fallback

**Example - HTML Entry Point**:
```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SecureBot - Security Analysis Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### 6. JSON (JavaScript Object Notation)
**Usage**: Data configuration and interchange

**Files Using JSON**:
- `package.json` (Dependencies and scripts)
- `tsconfig.json` (TypeScript configuration)
- `tsconfig.app.json` (App-specific TypeScript config)
- `tsconfig.node.json` (Node-specific TypeScript config)
- Configuration imports

**JSON Structure Examples**:

```json
{
  "name": "vite-react-typescript-starter",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "typescript": "^5.5.3",
    "@supabase/supabase-js": "^2.57.4"
  }
}
```

---

## Backend Languages

### 7. Deno (TypeScript Runtime)
**Version**: Latest (used in Edge Functions)

**Usage**: Supabase Edge Functions backend

**File Location**: `supabase/functions/codeql-analyze/index.ts`

**Deno Features Used**:
- Deno.serve() for HTTP handling
- Deno.Command() for subprocess execution
- Deno.makeTempDir() for file operations
- Deno.readTextFile() / Deno.writeTextFile()
- Web APIs (fetch, Response)

**Example - Deno Edge Function**:
```typescript
// Edge function for CodeQL analysis
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const { code, fileName, language } = await req.json();

  // Create database
  const dbDir = await Deno.makeTempDir();
  const createDb = new Deno.Command("codeql", {
    args: ["database", "create", dbDir, `--language=${language}`],
  });

  await createDb.output();

  // Process results
  return new Response(JSON.stringify({ success: true }));
});
```

---

### 8. Bash/Shell Scripts
**Usage**: Build scripts and utilities

**Common Commands**:
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Code linting
npm run typecheck # Type checking
```

---

## Query & Configuration Languages

### 9. CodeQL (QL)
**Version**: CodeQL 2.23.1

**Usage**: Security analysis queries

**Example - CodeQL Query**:
```ql
/**
 * @name SQL Injection
 * @description Database query built from user input
 * @kind path-problem
 * @problem.severity error
 * @id js/sql-injection
 */

import javascript
import semmle.javascript.security.dataflow.SqlInjectionQuery

from Configuration cfg, DataFlow::PathNode source, DataFlow::PathNode sink
where cfg.hasFlowPath(source, sink)
select sink.getNode(), source, sink,
  "This SQL query depends on $@.", source.getNode(), "user-provided value"
```

**CodeQL Features Used**:
- Data Flow Analysis
- Taint Tracking
- Path Problems
- Query Metadata
- Import Statements
- Predicates
- Variables

---

### 10. Regular Expressions (Regex)
**Version**: ECMAScript Regex

**Usage**: Pattern matching for vulnerability detection

**File**: `src/utils/vulnerabilityPatterns.ts`

**Example - Regex Patterns**:
```typescript
// SQL Injection Pattern
/\.query\s*\(\s*[`'"].*\$\{.*\}.*[`'"]\s*\)/g

// Command Injection Pattern
/(exec|execSync|spawn)\s*\([^)]*\$\{/g

// Hardcoded Credentials Pattern
/(api[_-]?key|apikey)\s*[:=]\s*['"`][A-Za-z0-9]{20,}['"`]/gi
```

---

### 11. SARIF (Static Analysis Results Interchange Format)
**Version**: 2.1.0

**Usage**: Standard format for CodeQL output

**Example - SARIF JSON Structure**:
```json
{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "CodeQL",
        "version": "2.23.1"
      }
    },
    "results": [{
      "ruleId": "js/sql-injection",
      "level": "error",
      "message": {
        "text": "SQL injection vulnerability detected"
      },
      "locations": [{
        "physicalLocation": {
          "artifactLocation": {
            "uri": "src/db.js"
          },
          "region": {
            "startLine": 42,
            "startColumn": 5
          }
        }
      }]
    }]
  }]
}
```

---

## Styling Languages

### 12. Tailwind CSS
**Version**: 3.4.1

**Usage**: Utility-first CSS framework

**File**: `tailwind.config.js`

**Tailwind Features Used**:
- Utility Classes
- Responsive Design
- Custom Themes
- Animations
- Plugins
- Color System
- Spacing System
- Grid & Flexbox

**Example - Tailwind Usage in TSX**:
```typescript
<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Shield className="text-blue-600" size={20} />
    Security Dashboard
  </h3>
</div>
```

---

### 13. PostCSS
**Version**: 8.4.35

**Usage**: CSS processing and optimization

**Plugins Used**:
- Tailwind CSS Plugin
- Autoprefixer Plugin

**File**: `postcss.config.js`

---

## Configuration Languages

### 14. YAML
**Usage**: Configuration files (though not in this project, can be added for CI/CD)

**Example - GitHub Actions (if added)**:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
```

---

### 15. Markdown
**Version**: CommonMark + GitHub Flavored Markdown

**Usage**: Documentation

**Files Using Markdown**:
- `README.md` (Project readme)
- `CODEQL_SETUP.md` (CodeQL setup guide)
- `PROJECT_DOCUMENTATION.md` (Complete documentation)
- `LANGUAGES_AND_TECHNOLOGIES.md` (This file)

**Markdown Features Used**:
- Headings
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Links
- Images
- Emphasis (bold, italic)
- Blockquotes

---

## Markup & Data Exchange

### 16. TOML
**Usage**: Configuration (Deno and potential future use)

**Example - deno.json** (if used):
```toml
{
  "tasks": {
    "dev": "deno run --allow-all main.ts"
  },
  "imports": {
    "std/": "https://deno.land/std@0.208.0/"
  }
}
```

---

### 17. Environment Variables (.env)
**Format**: KEY=VALUE

**File**: `.env` and `.env.example`

**Example**:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_GITHUB_CLIENT_ID=Iv1.xxxxx
```

---

## Package Management

### 18. NPM (Node Package Manager)
**Version**: Latest

**Package Manager Features Used**:
- Dependency installation
- Script execution
- Version management
- Monorepo support (if scaled)

**Main Dependencies**:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.2",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.344.0",
  "@supabase/supabase-js": "^2.57.4",
  "@octokit/rest": "^22.0.0",
  "googleapis": "^160.0.0",
  "@google-cloud/local-auth": "^3.0.1"
}
```

---

## Analysis Tools

### 19. ESLint
**Version**: 9.9.1

**Usage**: Code linting and quality checks

**Configuration File**: `eslint.config.js`

**ESLint Plugins Used**:
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

---

## Build & Development Tools

### 20. Vite
**Version**: 5.4.2

**Usage**: Build tool and dev server

**Configuration**: `vite.config.ts`

**Features**:
- Hot Module Replacement (HMR)
- Fast cold start
- Optimized build output
- ES modules
- Plugin system

---

## Language Summary Table

| Language | Version | Primary Use | File Count |
|----------|---------|-------------|-----------|
| **TypeScript** | 5.5.3 | Application logic | 24+ |
| **TSX** | React 18 | UI Components | 20+ |
| **JavaScript** | ES2020+ | Configuration | 3 |
| **CSS** | CSS3 | Styling | 1 |
| **HTML** | HTML5 | Markup | 1 |
| **JSON** | Standard | Config/Data | 5+ |
| **Markdown** | GFM | Documentation | 4 |
| **Bash** | POSIX | Scripts | - |
| **Deno TypeScript** | Latest | Backend (Edge Functions) | 1 |
| **CodeQL** | 2.23.1 | Security Queries | 10+ |
| **Regex** | ES | Pattern Matching | - |
| **SARIF** | 2.1.0 | Analysis Format | - |
| **Tailwind CSS** | 3.4.1 | Utilities | - |

---

## Language Distribution

```
TypeScript/TSX =============================== 65%
CSS/Styling ================================== 15%
JSON ========================================= 10%
Markdown/Documentation ====================== 7%
Other (Bash, Deno, etc.) ==================== 3%
```

---

## Supported Code Analysis Languages

The SecureBot application can analyze code written in:

### Frontend Languages (Pattern & CodeQL)
1. **JavaScript** (.js)
2. **TypeScript** (.ts, .tsx)
3. **JSX** (.jsx)

### Backend Languages (CodeQL only - requires backend setup)
4. **Python** (.py)
5. **Java** (.java)
6. **Go** (.go)
7. **C/C++** (.cpp, .c)
8. **C#** (.cs)
9. **Ruby** (.rb)
10. **PHP** (.php)
11. **Swift** (.swift)
12. **Kotlin** (.kt)

---

## Technology Stack by Layer

### Frontend Layer
- **Language**: TypeScript/TSX
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### State Management Layer
- **Language**: TypeScript
- **Method**: React Hooks (useState, useContext)
- **Pattern**: Component-level state

### API Integration Layer
- **Language**: TypeScript
- **Protocols**: HTTP/REST, OAuth 2.0
- **Services**: GitHub API, Google OAuth, Supabase

### Analysis Engine Layer
- **Languages**: TypeScript (Pattern), CodeQL (Semantic)
- **Analysis Methods**: Regex patterns, AST traversal
- **Output Format**: SARIF 2.1.0

### Backend Layer (Optional)
- **Language**: Deno TypeScript
- **Runtime**: Deno
- **Service**: Supabase Edge Functions
- **External Tool**: CodeQL CLI

### Configuration Layer
- **Languages**: JSON, JavaScript, YAML (optional)
- **Tools**: ESLint, TypeScript Compiler, Tailwind CSS

---

## Technology Comparison

### Analysis Approaches

| Aspect | Pattern-Based | CodeQL | Hybrid |
|--------|---------------|--------|--------|
| Language | Regex (All) | QL (10+) | Both |
| Speed | Very Fast | Slower | Medium |
| Accuracy | Medium | High | Very High |
| Complexity | Simple | Complex | Complex |
| Backend | None | Required | Optional |
| Coverage | Broad | Targeted | Complete |

---

## Future Technology Additions

### Planned Additions
- **Python**: For automation scripts
- **GraphQL**: For Supabase queries
- **Rust**: For performance-critical modules
- **WASM**: For client-side analysis acceleration
- **SQL**: For Supabase database queries
- **Docker**: For containerized deployment

---

## Conclusion

**SecureBot** leverages a modern, comprehensive technology stack combining:

1. **Frontend**: React + TypeScript for type-safe UI
2. **Styling**: Tailwind CSS for rapid development
3. **Analysis**: Pattern-based + CodeQL for comprehensive security checks
4. **Backend**: Supabase + Deno for serverless processing
5. **APIs**: GitHub + Google OAuth for integrations
6. **Tools**: Vite, ESLint for development efficiency

The project uses **15+ programming languages and technologies** across different layers, each chosen for its specific strengths in security analysis, user experience, and developer productivity.

