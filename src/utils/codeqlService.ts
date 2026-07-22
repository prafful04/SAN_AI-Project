export interface CodeQLQuery {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cwe: string;
  language: string;
}

export interface CodeQLResult {
  queryId: string;
  message: string;
  locations: Array<{
    file: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  }>;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cwe: string;
}

export interface CodeQLAnalysisResponse {
  success: boolean;
  results: CodeQLResult[];
  totalFindings: number;
  analysisTime: number;
  language: string;
  error?: string;
}

export const CODEQL_QUERIES: CodeQLQuery[] = [
  {
    id: 'js/sql-injection',
    name: 'SQL Injection',
    description: 'Detects SQL injection vulnerabilities using taint tracking',
    severity: 'High',
    cwe: 'CWE-89',
    language: 'javascript'
  },
  {
    id: 'js/xss',
    name: 'Cross-Site Scripting (XSS)',
    description: 'Detects XSS vulnerabilities through DOM manipulation',
    severity: 'High',
    cwe: 'CWE-79',
    language: 'javascript'
  },
  {
    id: 'js/command-line-injection',
    name: 'Command Injection',
    description: 'Detects command injection through shell execution',
    severity: 'Critical',
    cwe: 'CWE-78',
    language: 'javascript'
  },
  {
    id: 'js/code-injection',
    name: 'Code Injection',
    description: 'Detects code injection through eval or Function constructor',
    severity: 'Critical',
    cwe: 'CWE-94',
    language: 'javascript'
  },
  {
    id: 'js/hardcoded-credentials',
    name: 'Hardcoded Credentials',
    description: 'Detects hardcoded passwords, API keys, and secrets',
    severity: 'High',
    cwe: 'CWE-798',
    language: 'javascript'
  },
  {
    id: 'js/insecure-randomness',
    name: 'Insecure Randomness',
    description: 'Detects use of Math.random() for security-sensitive operations',
    severity: 'Medium',
    cwe: 'CWE-330',
    language: 'javascript'
  },
  {
    id: 'js/path-injection',
    name: 'Path Traversal',
    description: 'Detects path traversal vulnerabilities in file operations',
    severity: 'High',
    cwe: 'CWE-22',
    language: 'javascript'
  },
  {
    id: 'js/xxe',
    name: 'XML External Entity (XXE)',
    description: 'Detects XXE vulnerabilities in XML parsing',
    severity: 'High',
    cwe: 'CWE-611',
    language: 'javascript'
  },
  {
    id: 'js/insecure-download',
    name: 'Unvalidated URL Redirect',
    description: 'Detects open redirect vulnerabilities',
    severity: 'Medium',
    cwe: 'CWE-601',
    language: 'javascript'
  },
  {
    id: 'js/prototype-pollution',
    name: 'Prototype Pollution',
    description: 'Detects prototype pollution vulnerabilities',
    severity: 'High',
    cwe: 'CWE-1321',
    language: 'javascript'
  }
];

export class CodeQLService {
  private apiEndpoint: string;

  constructor(apiEndpoint?: string) {
    this.apiEndpoint = apiEndpoint || '/api/codeql/analyze';
  }

  async analyzeCode(code: string, fileName: string, language: string = 'javascript'): Promise<CodeQLAnalysisResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          fileName,
          language,
          queries: CODEQL_QUERIES.filter(q => q.language === language).map(q => q.id)
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        results: [],
        totalFindings: 0,
        analysisTime: 0,
        language,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async analyzeRepository(repoUrl: string): Promise<CodeQLAnalysisResponse> {
    try {
      const response = await fetch(`${this.apiEndpoint}/repository`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Repository analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        results: [],
        totalFindings: 0,
        analysisTime: 0,
        language: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  getAvailableQueries(language: string = 'javascript'): CodeQLQuery[] {
    return CODEQL_QUERIES.filter(q => q.language === language);
  }

  getQueryById(id: string): CodeQLQuery | undefined {
    return CODEQL_QUERIES.find(q => q.id === id);
  }
}

export const codeQLService = new CodeQLService();
