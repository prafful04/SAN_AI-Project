import React from 'react';
import { Info, CheckCircle, AlertCircle, Code } from 'lucide-react';

interface CodeQLInfoProps {
  mode: 'pattern' | 'codeql' | 'hybrid';
}

export function CodeQLInfo({ mode }: CodeQLInfoProps) {
  if (mode === 'pattern') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Pattern-Based Analysis</h4>
            <p className="text-sm text-blue-800 mb-2">
              Using fast regex-based pattern matching to detect common vulnerabilities.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Fast analysis speed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                No backend required
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle size={14} />
                May have false positives
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'codeql') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Code className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">CodeQL Analysis</h4>
            <p className="text-sm text-purple-800 mb-2">
              Using GitHub's semantic code analysis engine for deep security analysis.
            </p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Industry-leading accuracy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Advanced data flow analysis
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle size={14} />
                Requires backend setup
              </li>
            </ul>
            <div className="mt-3 p-3 bg-purple-100 rounded-lg">
              <p className="text-xs text-purple-900 font-medium mb-1">Setup Required</p>
              <p className="text-xs text-purple-700">
                CodeQL backend must be configured. See{' '}
                <a href="/CODEQL_SETUP.md" className="underline font-medium" target="_blank" rel="noopener noreferrer">
                  CODEQL_SETUP.md
                </a>{' '}
                for instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="flex items-center gap-1">
            <Info className="text-blue-600" size={20} />
            <Code className="text-purple-600" size={20} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hybrid Analysis</h4>
          <p className="text-sm text-gray-800 mb-2">
            Combining pattern-based and CodeQL analysis for comprehensive security coverage.
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              Best of both approaches
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              Maximum vulnerability coverage
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              Deduplicates findings
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle size={14} className="text-orange-600" />
              Slower analysis time
            </li>
          </ul>
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700">
              Falls back to pattern-based analysis if CodeQL backend is unavailable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
