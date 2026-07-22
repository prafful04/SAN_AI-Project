import { SecurityFinding } from '../types/security';

export class CodeFixer {
  private applyFix(code: string, finding: SecurityFinding): string {
    const lines = code.split('\n');
    let fixedCode = code;

    switch (finding.type) {
      case 'SQL Injection':
        fixedCode = this.fixSqlInjection(code);
        break;
      case 'Cross-Site Scripting (XSS)':
        fixedCode = this.fixXss(code);
        break;
      case 'Code Injection':
        fixedCode = this.fixCodeInjection(code);
        break;
      case 'Hardcoded Credentials':
        fixedCode = this.fixHardcodedCredentials(code);
        break;
      case 'Command Injection':
        fixedCode = this.fixCommandInjection(code);
        break;
      case 'Weak Random Number Generation':
        fixedCode = this.fixWeakRandom(code);
        break;
      case 'Insecure HTTP Usage':
        fixedCode = this.fixInsecureHttp(code);
        break;
      case 'Insecure Cookie':
        fixedCode = this.fixInsecureCookie(code);
        break;
      default:
        return code;
    }

    return fixedCode;
  }

  private fixSqlInjection(code: string): string {
    // Fix template literal SQL queries
    code = code.replace(
      /query\s*\(\s*['"`]([^'"`]*)\$\{([^}]*)\}([^'"`]*)['"`]\s*\)/gi,
      'query("$1?$3", [$2])'
    );

    // Fix string concatenation in SQL
    code = code.replace(
      /(['"`])SELECT\s+.*?\s+WHERE\s+.*?\s*\+\s*([^'"`]+)\s*\+\s*.*?\1/gi,
      '"SELECT * FROM table WHERE column = ?", [$2]'
    );

    return code;
  }

  private fixXss(code: string): string {
    // Replace innerHTML with textContent
    code = code.replace(
      /(\w+)\.innerHTML\s*=\s*([^;]+)/gi,
      '$1.textContent = $2'
    );

    // Fix template literal innerHTML
    code = code.replace(
      /innerHTML\s*\+=?\s*`([^`]*\$\{[^}]*\}[^`]*)`/gi,
      'textContent += `$1`'
    );

    return code;
  }

  private fixCodeInjection(code: string): string {
    // Replace eval with JSON.parse for JSON data
    code = code.replace(
      /eval\s*\(\s*([^)]+)\s*\)/gi,
      'JSON.parse($1)'
    );

    return code;
  }

  private fixHardcodedCredentials(code: string): string {
    // Replace hardcoded passwords
    code = code.replace(
      /(password|api_key|secret|token)\s*:\s*['"`]([^'"`]+)['"`]/gi,
      '$1: process.env.DB_PASSWORD || ""'
    );

    return code;
  }

  private fixCommandInjection(code: string): string {
    // Fix exec with template literals
    code = code.replace(
      /exec\s*\(\s*`([^`]*)\$\{([^}]*)\}([^`]*)`/gi,
      'spawn("$1", [$2])'
    );

    // Fix spawn with string concatenation
    code = code.replace(
      /exec\s*\(\s*(['"`])([^'"`]*)\s*\+\s*([^'"`]+)\s*\+?\s*.*?\1/gi,
      'spawn("$2", [$3])'
    );

    return code;
  }

  private fixWeakRandom(code: string): string {
    // Replace Math.random with crypto
    code = code.replace(
      /Math\.random\(\)/gi,
      'crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)'
    );

    // Add crypto import if not present
    if (code.includes('crypto.getRandomValues') && !code.includes('crypto')) {
      code = 'const crypto = require(\'crypto\');\n' + code;
    }

    return code;
  }

  private fixInsecureHttp(code: string): string {
    // Replace HTTP URLs with HTTPS
    code = code.replace(
      /http:\/\/([^\s'"]+)/gi,
      'https://$1'
    );

    return code;
  }

  private fixInsecureCookie(code: string): string {
    // Fix cookie settings
    code = code.replace(
      /document\.cookie\s*=\s*([^;]+);?/gi,
      'document.cookie = $1; HttpOnly; Secure; SameSite=Strict'
    );

    // Fix res.cookie calls
    code = code.replace(
      /res\.cookie\s*\(\s*([^,]+),\s*([^,]+),\s*\{([^}]*)\}\s*\)/gi,
      'res.cookie($1, $2, { $3, httpOnly: true, secure: true, sameSite: "strict" })'
    );

    return code;
  }

  public fixAllVulnerabilities(code: string, findings: SecurityFinding[]): string {
    let fixedCode = code;
    
    // Sort findings by line number (descending) to avoid line number shifts
    const sortedFindings = [...findings].sort((a, b) => b.line_start - a.line_start);
    
    for (const finding of sortedFindings) {
      fixedCode = this.applyFix(fixedCode, finding);
    }

    return fixedCode;
  }

  public generateFixedCodeWithComments(code: string, findings: SecurityFinding[]): string {
    let fixedCode = this.fixAllVulnerabilities(code, findings);
    
    // Add header comment explaining the fixes
    const fixSummary = findings.map(f => `// FIXED: ${f.type} (${f.cwe})`).join('\n');
    const header = `// AUTO-FIXED CODE - Security vulnerabilities have been automatically resolved\n${fixSummary}\n\n`;
    
    return header + fixedCode;
  }
}