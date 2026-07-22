import React from 'react';
import { AnalysisResult } from '../types/security';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ResultsDisplayProps {
  results: AnalysisResult;
  rawJson: string;
  showJson: boolean;
  onToggleJson: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  rawJson, 
  showJson, 
  onToggleJson 
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <XCircle className="text-red-600" size={20} />;
      case 'High':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'Medium':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'Low':
        return <Info className="text-blue-600" size={20} />;
      default:
        return <Info className="text-gray-600" size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'border-red-500 bg-red-50';
      case 'High':
        return 'border-orange-500 bg-orange-50';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'Low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Analysis Results
        </h3>
        <div className="flex items-center gap-4">
          {results.findings.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <AlertTriangle size={16} />
              {results.findings.length} vulnerabilities found
            </div>
          )}
          <button
            onClick={onToggleJson}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showJson ? 'Hide JSON' : 'Show JSON'}
          </button>
        </div>
      </div>

      {results.findings.length === 0 ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h4 className="font-medium text-green-800">No vulnerabilities detected</h4>
            <p className="text-sm text-green-700">The analyzed code appears to be secure.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {results.findings.map((finding, index) => (
            <div
              key={index}
              className={`p-4 border-l-4 rounded-lg ${getSeverityColor(finding.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(finding.severity)}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{finding.type}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">{finding.cwe}</span>
                      <span className="font-medium">{finding.severity}</span>
                      <span>({Math.round(finding.confidence * 100)}% confidence)</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {finding.file} (lines {finding.line_start}-{finding.line_end})
                  </div>
                  
                  <p className="text-gray-800">{finding.explanation}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Suggested Fix:</h5>
                      <code className="block p-2 bg-gray-100 rounded text-sm font-mono">
                        {finding.suggested_fix}
                      </code>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Recommended Test:</h5>
                      <p className="text-sm text-gray-700 italic">{finding.tests_to_add}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showJson && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-2">Raw JSON Output:</h4>
          <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
            {rawJson}
          </pre>
        </div>
      )}
    </div>
  );
};