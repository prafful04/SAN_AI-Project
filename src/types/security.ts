export interface SecurityFinding {
  file: string;
  line_start: number;
  line_end: number;
  type: string;
  cwe: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  explanation: string;
  suggested_fix: string;
  tests_to_add: string;
}

export interface AnalysisResult {
  findings: SecurityFinding[];
}

export interface VulnerabilityPattern {
  pattern: RegExp;
  type: string;
  cwe: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  explanation: string;
  suggested_fix: string;
  tests_to_add: string;
}