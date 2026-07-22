import React, { useState } from 'react';
import { Shield, Scan, Download, Zap, Activity, AlertTriangle, Settings } from 'lucide-react';
import { SecurityAnalyzer, AnalysisMode } from './utils/securityAnalyzer';
import { AnalysisResult } from './types/security';
import { CodeInput } from './components/CodeInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ExampleCode } from './components/ExampleCode';
import { AutoExamples } from './components/AutoExamples';
import { CodeFixer } from './components/CodeFixer';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { GitHubIntegration } from './components/GitHubIntegration';
import { AnimatedBackground } from './components/AnimatedBackground';
import { SecurityMetrics } from './components/SecurityMetrics';
import { VulnerabilityChart } from './components/VulnerabilityChart';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SecurityBadge } from './components/SecurityBadge';
import { InteractiveCodeBlock } from './components/InteractiveCodeBlock';
import { CodeQLInfo } from './components/CodeQLInfo';

function App() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('analysis.js');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [rawJson, setRawJson] = useState('');
  const [totalScans, setTotalScans] = useState(42);
  const [totalFixed, setTotalFixed] = useState(0);
  const [sessionVulnerabilities, setSessionVulnerabilities] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('pattern');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const analyzer = new SecurityAnalyzer({ mode: analysisMode });

  const handleLogin = (userData: { email: string; name: string; role: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCode('');
    setResults(null);
    setShowJson(false);
    setRawJson('');
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setTotalScans(prev => prev + 1);

    try {
      analyzer.setMode(analysisMode);
      const analysisResults = await analyzer.analyze(code, fileName);
      setResults(analysisResults);
      setRawJson(JSON.stringify(analysisResults, null, 2));
      setSessionVulnerabilities(analysisResults.findings.length);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    setShowModeSelector(false);
  };

  const downloadResults = () => {
    if (!results) return;
    
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-analysis-${fileName.replace(/\.[^/.]+$/, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleCode: string, exampleFileName: string) => {
    setCode(exampleCode);
    setFileName(exampleFileName);
    setResults(null);
    setShowJson(false);
  };

  const applyFixedCode = (fixedCode: string) => {
    setCode(fixedCode);
    if (results) {
      setTotalFixed(prev => prev + results.findings.length);
    }
    setResults(null);
    setShowJson(false);
  };

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const securityScore = Math.max(0, Math.min(100, 100 - Math.max(0, sessionVulnerabilities - totalFixed)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg animate-glow">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">SecureBot</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" />
                  {analysisMode === 'codeql' ? 'CodeQL-Powered' : analysisMode === 'hybrid' ? 'Hybrid' : 'Pattern-Based'} Security Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowModeSelector(!showModeSelector)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Settings size={18} />
                  <span className="text-sm font-medium">
                    {analysisMode === 'codeql' ? 'CodeQL' : analysisMode === 'hybrid' ? 'Hybrid' : 'Pattern'}
                  </span>
                </button>
                {showModeSelector && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleModeChange('pattern')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          analysisMode === 'pattern' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">Pattern-Based</div>
                        <div className="text-xs text-gray-500">Fast regex-based analysis</div>
                      </button>
                      <button
                        onClick={() => handleModeChange('codeql')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          analysisMode === 'codeql' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">CodeQL</div>
                        <div className="text-xs text-gray-500">Advanced semantic analysis</div>
                      </button>
                      <button
                        onClick={() => handleModeChange('hybrid')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          analysisMode === 'hybrid' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">Hybrid Mode</div>
                        <div className="text-xs text-gray-500">Combined pattern + CodeQL</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Welcome back,</div>
                <div className="font-medium text-gray-900">{user.name}</div>
              </div>
              <UserProfile user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Security Metrics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Dashboard</h2>
          <p className="text-gray-600">Real-time security analysis metrics and vulnerability tracking</p>
        </div>
        <SecurityMetrics
          totalScans={totalScans}
          vulnerabilitiesFixed={totalFixed}
          securityScore={securityScore}
        />
        
        {/* Session Summary */}
        {sessionVulnerabilities > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle size={20} />
              <span className="font-medium">
                Session Summary: {sessionVulnerabilities} vulnerabilities found in current session
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300">
              <CodeInput
                code={code}
                onCodeChange={setCode}
                fileName={fileName}
                onFileNameChange={setFileName}
              />
              
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={analyzeCode}
                  disabled={!code.trim() || isAnalyzing}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Scan size={20} />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                </button>
                
                {results && (
                  <button
                    onClick={downloadResults}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Download size={20} />
                    Download JSON
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <LoadingSpinner message="Scanning for vulnerabilities..." size="lg" />
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                    <ResultsDisplay
                      results={results}
                      rawJson={rawJson}
                      showJson={showJson}
                      onToggleJson={() => setShowJson(!showJson)}
                    />
                  </div>
                  <VulnerabilityChart results={results} />
                </div>
                
                {/* Interactive Code Block */}
                {code && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity size={20} className="text-blue-600" />
                      Code Analysis
                    </h3>
                    <InteractiveCodeBlock
                      code={code}
                      title={fileName}
                      vulnerabilities={results.findings.map(f => ({
                        line: f.line_start,
                        type: f.type,
                        severity: f.severity
                      }))}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Code Fixer */}
            {results && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <CodeFixer
                  code={code}
                  results={results}
                  fileName={fileName}
                  onApplyFix={applyFixedCode}
                />
              </div>
            )}
          </div>

          {/* Right Column - Examples */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <CodeQLInfo mode={analysisMode} />
            </div>

            <GitHubIntegration
              onLoadCode={loadExample}
              onAnalysisComplete={setResults}
            />

            <AutoExamples
              onLoadExample={loadExample}
              onAnalyze={analyzeCode}
            />

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <ExampleCode onLoadExample={loadExample} />
            </div>

            {/* Info Panel */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Supported Vulnerabilities</h3>
              <div className="space-y-3">
                {[
                  { name: 'SQL Injection', cwe: 'CWE-89', severity: 'High' as const },
                  { name: 'Cross-Site Scripting', cwe: 'CWE-79', severity: 'High' as const },
                  { name: 'Command Injection', cwe: 'CWE-78', severity: 'Critical' as const },
                  { name: 'Code Injection', cwe: 'CWE-94', severity: 'Critical' as const },
                  { name: 'Hardcoded Credentials', cwe: 'CWE-798', severity: 'High' as const },
                  { name: 'Weak Random Numbers', cwe: 'CWE-330', severity: 'Medium' as const },
                  { name: 'Insecure HTTP', cwe: 'CWE-319', severity: 'Medium' as const },
                  { name: 'Insecure Cookies', cwe: 'CWE-1004', severity: 'Medium' as const }
                ].map((vuln, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{vuln.name}</div>
                      <div className="text-xs text-gray-500">{vuln.cwe}</div>
                    </div>
                    <SecurityBadge severity={vuln.severity} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;