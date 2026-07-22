import { CodeQLResult, CodeQLAnalysisResponse } from './codeqlService';
import { AnalysisResult, Finding } from '../types/security';

export class CodeQLAdapter {
  convertToAnalysisResult(
    codeqlResponse: CodeQLAnalysisResponse,
    fileName: string
  ): AnalysisResult {
    const findings: Finding[] = codeqlResponse.results.map((result, index) => {
      const location = result.locations[0];

      return {
        id: `${result.queryId}-${index}`,
        type: this.mapQueryIdToType(result.queryId),
        severity: result.severity,
        description: result.message,
        cwe: result.cwe,
        file: location.file,
        line_start: location.startLine,
        line_end: location.endLine,
        column_start: location.startColumn,
        column_end: location.endColumn,
        code_snippet: '',
        recommendation: this.getRecommendation(result.queryId),
        confidence: 'High'
      };
    });

    const severityCounts = {
      Critical: findings.filter(f => f.severity === 'Critical').length,
      High: findings.filter(f => f.severity === 'High').length,
      Medium: findings.filter(f => f.severity === 'Medium').length,
      Low: findings.filter(f => f.severity === 'Low').length
    };

    const riskScore = this.calculateRiskScore(severityCounts);

    return {
      scan_id: `codeql-${Date.now()}`,
      timestamp: new Date().toISOString(),
      file_name: fileName,
      language: codeqlResponse.language,
      total_lines: 0,
      findings,
      summary: {
        total_issues: findings.length,
        critical: severityCounts.Critical,
        high: severityCounts.High,
        medium: severityCounts.Medium,
        low: severityCounts.Low,
        risk_score: riskScore
      },
      metadata: {
        analyzer_version: 'CodeQL 2.23.1',
        scan_duration_ms: codeqlResponse.analysisTime,
        rules_evaluated: codeqlResponse.results.length
      }
    };
  }

  private mapQueryIdToType(queryId: string): string {
    const typeMap: Record<string, string> = {
      'js/sql-injection': 'SQL Injection',
      'js/xss': 'Cross-Site Scripting (XSS)',
      'js/command-line-injection': 'Command Injection',
      'js/code-injection': 'Code Injection',
      'js/hardcoded-credentials': 'Hardcoded Credentials',
      'js/insecure-randomness': 'Insecure Randomness',
      'js/path-injection': 'Path Traversal',
      'js/xxe': 'XML External Entity (XXE)',
      'js/insecure-download': 'Unvalidated URL Redirect',
      'js/prototype-pollution': 'Prototype Pollution'
    };

    return typeMap[queryId] || queryId;
  }

  private getRecommendation(queryId: string): string {
    const recommendations: Record<string, string> = {
      'js/sql-injection': 'Use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries.',
      'js/xss': 'Sanitize all user input before rendering in the DOM. Use frameworks that auto-escape by default or use DOMPurify.',
      'js/command-line-injection': 'Avoid executing shell commands with user input. Use safe APIs that don\'t invoke the shell, or strictly validate input.',
      'js/code-injection': 'Never use eval() or Function() constructor with user input. Use safer alternatives like JSON.parse() for data.',
      'js/hardcoded-credentials': 'Store credentials in environment variables or secure credential management systems. Never hardcode secrets.',
      'js/insecure-randomness': 'Use crypto.randomBytes() or window.crypto.getRandomValues() for security-sensitive random number generation.',
      'js/path-injection': 'Validate and sanitize file paths. Use path.resolve() and check that resolved paths are within expected directories.',
      'js/xxe': 'Disable external entity processing in XML parsers. Use secure parser configurations.',
      'js/insecure-download': 'Validate redirect URLs against a whitelist. Avoid using user input directly in redirects.',
      'js/prototype-pollution': 'Validate object keys before setting properties. Use Object.create(null) for maps or use Map/Set.'
    };

    return recommendations[queryId] || 'Review the code and apply security best practices.';
  }

  private calculateRiskScore(severityCounts: Record<string, number>): number {
    const weights = {
      Critical: 10,
      High: 7,
      Medium: 4,
      Low: 1
    };

    const totalScore =
      severityCounts.Critical * weights.Critical +
      severityCounts.High * weights.High +
      severityCounts.Medium * weights.Medium +
      severityCounts.Low * weights.Low;

    return Math.min(100, Math.round(totalScore));
  }

  convertFindingsToCodeQL(findings: Finding[]): CodeQLResult[] {
    return findings.map(finding => ({
      queryId: this.mapTypeToQueryId(finding.type),
      message: finding.description,
      locations: [{
        file: finding.file,
        startLine: finding.line_start,
        endLine: finding.line_end,
        startColumn: finding.column_start || 1,
        endColumn: finding.column_end || 1
      }],
      severity: finding.severity,
      cwe: finding.cwe
    }));
  }

  private mapTypeToQueryId(type: string): string {
    const queryIdMap: Record<string, string> = {
      'SQL Injection': 'js/sql-injection',
      'Cross-Site Scripting (XSS)': 'js/xss',
      'Command Injection': 'js/command-line-injection',
      'Code Injection': 'js/code-injection',
      'Hardcoded Credentials': 'js/hardcoded-credentials',
      'Insecure Randomness': 'js/insecure-randomness',
      'Path Traversal': 'js/path-injection',
      'XML External Entity (XXE)': 'js/xxe',
      'Unvalidated URL Redirect': 'js/insecure-download',
      'Prototype Pollution': 'js/prototype-pollution'
    };

    return queryIdMap[type] || type.toLowerCase().replace(/\s+/g, '-');
  }
}

export const codeqlAdapter = new CodeQLAdapter();
