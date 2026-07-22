import React, { useState } from 'react';
import { Wrench, Download, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types/security';
import { CodeFixer as CodeFixerUtil } from '../utils/codeFixer';

interface CodeFixerProps {
  code: string;
  results: AnalysisResult;
  fileName: string;
  onApplyFix: (fixedCode: string) => void;
}

export const CodeFixer: React.FC<CodeFixerProps> = ({ 
  code, 
  results, 
  fileName, 
  onApplyFix 
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const codeFixer = new CodeFixerUtil();

  const applyFixes = async () => {
    setIsFixing(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const fixed = codeFixer.generateFixedCodeWithComments(code, results.findings);
      setFixedCode(fixed);
      setIsFixing(false);
    }, 1500);
  };

  const applyFixedCode = () => {
    if (fixedCode) {
      onApplyFix(fixedCode);
      setFixedCode(null);
      setShowDiff(false);
    }
  };

  const downloadFixedCode = () => {
    if (!fixedCode) return;
    
    const blob = new Blob([fixedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixed-${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyFixedCode = () => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
    }
  };

  const generateDiff = () => {
    if (!fixedCode) return '';
    
    const originalLines = code.split('\n');
    const fixedLines = fixedCode.split('\n');
    
    let diff = '';
    const maxLines = Math.max(originalLines.length, fixedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const fixedLine = fixedLines[i] || '';
      
      if (originalLine !== fixedLine) {
        if (originalLine && !fixedLine) {
          diff += `- ${originalLine}\n`;
        } else if (!originalLine && fixedLine) {
          diff += `+ ${fixedLine}\n`;
        } else if (originalLine !== fixedLine) {
          diff += `- ${originalLine}\n`;
          diff += `+ ${fixedLine}\n`;
        }
      } else if (originalLine) {
        diff += `  ${originalLine}\n`;
      }
    }
    
    return diff;
  };

  if (results.findings.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle size={20} />
          <span className="font-medium">No fixes needed</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          The code appears to be secure and doesn't require any automatic fixes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Automatic Code Fixes</h3>
        </div>
        
        {!fixedCode ? (
          <button
            onClick={applyFixes}
            disabled={isFixing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Wrench size={16} />
            {isFixing ? 'Fixing...' : `Fix ${results.findings.length} Issues`}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {showDiff ? 'Hide Diff' : 'Show Diff'}
            </button>
            <button
              onClick={copyFixedCode}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Copy fixed code"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={downloadFixedCode}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Download fixed code"
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>

      {isFixing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <h4 className="font-medium text-blue-800">Applying Security Fixes</h4>
              <p className="text-sm text-blue-700">
                Automatically resolving {results.findings.length} security vulnerabilities...
              </p>
            </div>
          </div>
        </div>
      )}

      {fixedCode && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle size={20} />
              <h4 className="font-medium">Fixes Applied Successfully</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              {results.findings.length} security vulnerabilities have been automatically resolved.
            </p>
            
            <div className="space-y-2">
              {results.findings.map((finding, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-green-800">
                    Fixed {finding.type} on line {finding.line_start}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={applyFixedCode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Apply Fixed Code
              </button>
            </div>
          </div>

          {showDiff && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Code Changes</h4>
              <pre className="text-xs font-mono bg-white p-3 rounded border overflow-x-auto">
                {generateDiff()}
              </pre>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Fixed Code Preview</h4>
            <pre className="text-xs font-mono bg-white p-3 rounded border overflow-x-auto max-h-64">
              {fixedCode}
            </pre>
          </div>
        </div>
      )}

      {/* Fix Summary */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
          <div className="text-sm">
            <h4 className="font-medium text-yellow-800 mb-1">Important Notes</h4>
            <ul className="text-yellow-700 space-y-1">
              <li>• Always review automatically fixed code before deploying</li>
              <li>• Test the fixed code thoroughly in your development environment</li>
              <li>• Some fixes may require additional configuration (e.g., environment variables)</li>
              <li>• Consider implementing the suggested unit tests for each fix</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};