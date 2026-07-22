# CodeQL Integration Setup Guide

This application is designed to integrate with CodeQL for advanced security analysis. This guide explains how to set up and use CodeQL with the application.

## What is CodeQL?

CodeQL is GitHub's industry-leading semantic code analysis engine that treats code as data, allowing you to query it to find security vulnerabilities and coding errors. It supports multiple languages including JavaScript, TypeScript, Python, Java, C++, Go, and more.

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│   (Browser)     │
└────────┬────────┘
         │
         │ HTTP POST /api/codeql/analyze
         │
         ▼
┌─────────────────┐
│ Edge Function   │
│ (Supabase)      │
└────────┬────────┘
         │
         │ Executes CodeQL CLI
         │
         ▼
┌─────────────────┐
│  CodeQL Engine  │
│  (Analysis)     │
└─────────────────┘
```

## Prerequisites

1. **CodeQL CLI** - Download from: https://github.com/github/codeql-cli-binaries/releases
2. **CodeQL Standard Library** - Clone from: https://github.com/github/codeql
3. **Supabase Project** - With Edge Functions enabled

## Installation Steps

### 1. Install CodeQL CLI

```bash
# Download and extract CodeQL CLI
wget https://github.com/github/codeql-cli-binaries/releases/latest/download/codeql-linux64.zip
unzip codeql-linux64.zip

# Add to PATH
export PATH="$PATH:/path/to/codeql"

# Verify installation
codeql --version
```

### 2. Clone CodeQL Standard Library

```bash
git clone https://github.com/github/codeql.git codeql-repo
```

### 3. Create Supabase Edge Function

Create a file at `supabase/functions/codeql-analyze/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  code: string;
  fileName: string;
  language: string;
  queries: string[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code, fileName, language, queries }: AnalysisRequest = await req.json();

    const tempDir = await Deno.makeTempDir();
    const sourceFile = `${tempDir}/${fileName}`;
    const dbDir = `${tempDir}/codeql-db`;

    await Deno.writeTextFile(sourceFile, code);

    const startTime = Date.now();

    const createDb = new Deno.Command("codeql", {
      args: [
        "database",
        "create",
        dbDir,
        `--language=${language}`,
        `--source-root=${tempDir}`,
      ],
    });

    await createDb.output();

    const resultsFile = `${tempDir}/results.sarif`;
    const analyze = new Deno.Command("codeql", {
      args: [
        "database",
        "analyze",
        dbDir,
        `${language}-security-and-quality.qls`,
        `--format=sarif-latest`,
        `--output=${resultsFile}`,
      ],
    });

    await analyze.output();

    const resultsContent = await Deno.readTextFile(resultsFile);
    const sarif = JSON.parse(resultsContent);

    const results = sarif.runs[0].results.map((result: any) => ({
      queryId: result.ruleId,
      message: result.message.text,
      locations: result.locations.map((loc: any) => ({
        file: loc.physicalLocation.artifactLocation.uri,
        startLine: loc.physicalLocation.region.startLine,
        endLine: loc.physicalLocation.region.endLine || loc.physicalLocation.region.startLine,
        startColumn: loc.physicalLocation.region.startColumn || 1,
        endColumn: loc.physicalLocation.region.endColumn || 1,
      })),
      severity: result.level === "error" ? "High" : result.level === "warning" ? "Medium" : "Low",
      cwe: result.properties?.tags?.find((t: string) => t.startsWith("CWE-")) || "Unknown",
    }));

    await Deno.remove(tempDir, { recursive: true });

    const analysisTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        results,
        totalFindings: results.length,
        analysisTime,
        language,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        results: [],
        totalFindings: 0,
        analysisTime: 0,
        language: "unknown",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
```

### 4. Deploy Edge Function

```bash
supabase functions deploy codeql-analyze
```

### 5. Configure Frontend

Update your `.env` file:

```env
VITE_CODEQL_API_ENDPOINT=https://your-project.supabase.co/functions/v1/codeql-analyze
```

## Available CodeQL Queries

### JavaScript/TypeScript

- `js/sql-injection` - SQL Injection (CWE-89)
- `js/xss` - Cross-Site Scripting (CWE-79)
- `js/command-line-injection` - Command Injection (CWE-78)
- `js/code-injection` - Code Injection (CWE-94)
- `js/hardcoded-credentials` - Hardcoded Credentials (CWE-798)
- `js/insecure-randomness` - Insecure Randomness (CWE-330)
- `js/path-injection` - Path Traversal (CWE-22)
- `js/xxe` - XML External Entity (CWE-611)
- `js/insecure-download` - Unvalidated URL Redirect (CWE-601)
- `js/prototype-pollution` - Prototype Pollution (CWE-1321)

## Usage

### Analyze Code Snippet

```typescript
import { codeQLService } from './utils/codeqlService';

const result = await codeQLService.analyzeCode(
  code,
  'example.js',
  'javascript'
);

console.log(`Found ${result.totalFindings} vulnerabilities`);
```

### Analyze GitHub Repository

```typescript
const result = await codeQLService.analyzeRepository(
  'https://github.com/username/repo'
);
```

## CodeQL CLI Commands Reference

### Create Database

```bash
codeql database create <database-name> \
  --language=<language> \
  --source-root=<source-directory>
```

### Analyze Database

```bash
codeql database analyze <database-name> \
  <query-suite> \
  --format=sarif-latest \
  --output=<results-file.sarif>
```

### Run Specific Query

```bash
codeql query run <query-file.ql> \
  --database=<database-name> \
  --output=<results-file.bqrs>
```

## Custom Queries

You can create custom CodeQL queries to detect specific vulnerabilities:

```ql
/**
 * @name Detect hardcoded API keys
 * @kind problem
 * @problem.severity error
 * @id js/hardcoded-api-key
 */

import javascript

from StringLiteral str
where str.getValue().regexpMatch(".*[A-Za-z0-9]{32,}.*")
  and str.getParentExpr().(Assignment).getLhs().(PropAccess).getPropertyName() = "apiKey"
select str, "Potential hardcoded API key detected"
```

## Performance Optimization

1. **Database Caching** - Cache CodeQL databases for repositories to avoid recreating them
2. **Incremental Analysis** - Only analyze changed files
3. **Query Selection** - Run only relevant queries based on code type
4. **Parallel Processing** - Use `--threads` flag for faster analysis

## Troubleshooting

### Error: "CodeQL command not found"

Ensure CodeQL CLI is installed and in your PATH:

```bash
export PATH="$PATH:/path/to/codeql"
```

### Error: "Database creation failed"

Check that the source code is valid and the language is supported:

```bash
codeql resolve languages
```

### Edge Function Timeout

For large repositories, increase the function timeout in Supabase dashboard or use asynchronous analysis with webhooks.

## Security Considerations

1. **Input Validation** - Validate all code input before analysis
2. **Resource Limits** - Set memory and time limits for analysis
3. **Sandboxing** - Run CodeQL in isolated environments
4. **Rate Limiting** - Implement rate limiting to prevent abuse

## Additional Resources

- [CodeQL Documentation](https://codeql.github.com/docs/)
- [CodeQL for JavaScript](https://codeql.github.com/docs/codeql-language-guides/codeql-for-javascript/)
- [Writing CodeQL Queries](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Query Help](https://codeql.github.com/codeql-query-help/)

## License

CodeQL is free for research and open source projects. For commercial use, check GitHub's licensing terms.
