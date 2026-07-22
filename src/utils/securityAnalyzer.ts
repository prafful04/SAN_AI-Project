import { AnalysisResult, Finding } from '../types/security';
import { vulnerabilityPatterns } from './vulnerabilityPatterns';
import { codeQLService, CodeQLAnalysisResponse } from './codeqlService';
import { codeqlAdapter } from './codeqlAdapter';

export type AnalysisMode = 'pattern' | 'codeql' | 'hybrid';

export interface AnalyzerConfig {
  mode: AnalysisMode;
  codeqlEndpoint?: string;
  useCache?: boolean;
}

export class SecurityAnalyzer {
  private config: AnalyzerConfig;

  constructor(config: AnalyzerConfig = { mode: 'pattern', useCache: true }) {
    this.config = config;
  }

  async analyze(code: string, fileName: string = 'analysis.js'): Promise<AnalysisResult> {
    switch (this.config.mode) {
      case 'codeql':
        return await this.analyzeWithCodeQL(code, fileName);
      case 'hybrid':
        return await this.analyzeHybrid(code, fileName);
      case 'pattern':
      default:
        return this.analyzeWithPatterns(code, fileName);
    }
  }

  private async analyzeWithCodeQL(code: string, fileName: string): Promise<AnalysisResult> {
    const language = this.detectLanguage(fileName);
    const codeqlResponse = await codeQLService.analyzeCode(code, fileName, language);

    if (!codeqlResponse.success) {
      console.warn('CodeQL analysis failed, falling back to pattern matching:', codeqlResponse.error);
      return this.analyzeWithPatterns(code, fileName);
    }

    return codeqlAdapter.convertToAnalysisResult(codeqlResponse, fileName);
  }

  private async analyzeHybrid(code: string, fileName: string): Promise<AnalysisResult> {
    const [patternResults, codeqlResponse] = await Promise.all([
      Promise.resolve(this.analyzeWithPatterns(code, fileName)),
      codeQLService.analyzeCode(code, fileName, this.detectLanguage(fileName))
    ]);

    if (!codeqlResponse.success) {
      return patternResults;
    }

    const codeqlResults = codeqlAdapter.convertToAnalysisResult(codeqlResponse, fileName);

    const combinedFindings = this.mergeFindings(
      patternResults.findings,
      codeqlResults.findings
    );

    const severityCounts = {
      Critical: combinedFindings.filter(f => f.severity === 'Critical').length,
      High: combinedFindings.filter(f => f.severity === 'High').length,
      Medium: combinedFindings.filter(f => f.severity === 'Medium').length,
      Low: combinedFindings.filter(f => f.severity === 'Low').length
    };

    return {
      scan_id: `hybrid-${Date.now()}`,
      timestamp: new Date().toISOString(),
      file_name: fileName,
      language: this.detectLanguage(fileName),
      total_lines: code.split('\n').length,
      findings: combinedFindings,
      summary: {
        total_issues: combinedFindings.length,
        critical: severityCounts.Critical,
        high: severityCounts.High,
        medium: severityCounts.Medium,
        low: severityCounts.Low,
        risk_score: this.calculateRiskScore(severityCounts)
      },
      metadata: {
        analyzer_version: 'Hybrid (Pattern + CodeQL)',
        scan_duration_ms: 0,
        rules_evaluated: vulnerabilityPatterns.length
      }
    };
  }

  analyzeWithPatterns(code: string, fileName: string = 'analysis.js'): AnalysisResult {
    const maskedCode = this.maskSecrets(code);
    const findings: Finding[] = [];
    let findingId = 0;

    for (const pattern of vulnerabilityPatterns) {
      let match;
      pattern.pattern.lastIndex = 0;

      while ((match = pattern.pattern.exec(maskedCode)) !== null) {
        const [lineStart, lineEnd] = this.getLineRange(maskedCode, match.index, match[0].length);
        const codeSnippet = this.extractCodeSnippet(maskedCode, lineStart, lineEnd);

        const finding: Finding = {
          id: `pattern-${findingId++}`,
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.explanation,
          cwe: pattern.cwe,
          file: fileName,
          line_start: lineStart,
          line_end: lineEnd,
          column_start: 1,
          column_end: 1,
          code_snippet: codeSnippet,
          recommendation: pattern.suggested_fix,
          confidence: pattern.confidence
        };

        findings.push(finding);

        if (match.index === pattern.pattern.lastIndex) {
          pattern.pattern.lastIndex++;
        }
      }
    }

    const totalLines = code.split('\n').length;
    const severityCounts = {
      Critical: findings.filter(f => f.severity === 'Critical').length,
      High: findings.filter(f => f.severity === 'High').length,
      Medium: findings.filter(f => f.severity === 'Medium').length,
      Low: findings.filter(f => f.severity === 'Low').length
    };

    return {
      scan_id: `pattern-${Date.now()}`,
      timestamp: new Date().toISOString(),
      file_name: fileName,
      language: this.detectLanguage(fileName),
      total_lines: totalLines,
      findings,
      summary: {
        total_issues: findings.length,
        critical: severityCounts.Critical,
        high: severityCounts.High,
        medium: severityCounts.Medium,
        low: severityCounts.Low,
        risk_score: this.calculateRiskScore(severityCounts)
      },
      metadata: {
        analyzer_version: '1.0.0',
        scan_duration_ms: 0,
        rules_evaluated: vulnerabilityPatterns.length
      }
    };
  }

  private mergeFindings(findings1: Finding[], findings2: Finding[]): Finding[] {
    const merged = [...findings1];
    const seenFindings = new Set(
      findings1.map(f => `${f.type}-${f.line_start}-${f.line_end}`)
    );

    for (const finding of findings2) {
      const key = `${finding.type}-${finding.line_start}-${finding.line_end}`;
      if (!seenFindings.has(key)) {
        merged.push(finding);
        seenFindings.add(key);
      }
    }

    return merged.sort((a, b) => a.line_start - b.line_start);
  }

  private maskSecrets(code: string): string {
    return code
      .replace(/(api_key|password|secret|token)\s*[:=]\s*['"`]([^'"`]+)['"`]/gi, '$1: "***REDACTED***"')
      .replace(/Bearer\s+[A-Za-z0-9\-_]+/gi, 'Bearer ***REDACTED***');
  }

  private findLineNumber(code: string, matchIndex: number): number {
    const beforeMatch = code.substring(0, matchIndex);
    return beforeMatch.split('\n').length;
  }

  private getLineRange(code: string, matchIndex: number, matchLength: number): [number, number] {
    const lineStart = this.findLineNumber(code, matchIndex);
    const lineEnd = this.findLineNumber(code, matchIndex + matchLength);
    return [lineStart, lineEnd];
  }

  private extractCodeSnippet(code: string, lineStart: number, lineEnd: number): string {
    const lines = code.split('\n');
    return lines.slice(lineStart - 1, lineEnd).join('\n');
  }

  private detectLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'cpp',
      'go': 'go',
      'rb': 'ruby',
      'php': 'php',
      'cs': 'csharp'
    };
    return languageMap[ext] || 'javascript';
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

  setMode(mode: AnalysisMode): void {
    this.config.mode = mode;
  }

  getMode(): AnalysisMode {
    return this.config.mode;
  }

  getAvailableQueries(language: string = 'javascript') {
    return codeQLService.getAvailableQueries(language);
  }
}
