import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Zap } from 'lucide-react';

interface InteractiveCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  vulnerabilities?: Array<{
    line: number;
    type: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }>;
}

export const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
  code,
  language = 'javascript',
  title,
  vulnerabilities = []
}) => {
  const [copied, setCopied] = useState(false);
  const [showVulnerabilities, setShowVulnerabilities] = useState(true);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const lines = code.split('\n');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineVulnerability = (lineNumber: number) => {
    return vulnerabilities.find(v => v.line === lineNumber);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 border-l-red-500';
      case 'High': return 'bg-orange-500/20 border-l-orange-500';
      case 'Medium': return 'bg-yellow-500/20 border-l-yellow-500';
      case 'Low': return 'bg-blue-500/20 border-l-blue-500';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          {title && (
            <span className="text-gray-300 text-sm font-medium">{title}</span>
          )}
          <span className="text-gray-500 text-xs px-2 py-1 bg-gray-700 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {vulnerabilities.length > 0 && (
            <button
              onClick={() => setShowVulnerabilities(!showVulnerabilities)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {showVulnerabilities ? <EyeOff size={14} /> : <Eye size={14} />}
              Vulnerabilities
            </button>
          )}
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-gray-300 font-mono">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const vulnerability = getLineVulnerability(lineNumber);
              const isVulnerable = vulnerability && showVulnerabilities;
              
              return (
                <div
                  key={index}
                  className={`
                    flex items-start group relative
                    ${isVulnerable ? `${getSeverityColor(vulnerability.severity)} border-l-4 pl-2` : ''}
                    ${hoveredLine === lineNumber ? 'bg-gray-800/50' : ''}
                    hover:bg-gray-800/30 transition-colors
                  `}
                  onMouseEnter={() => setHoveredLine(lineNumber)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {/* Line Number */}
                  <span className="text-gray-500 text-xs w-8 flex-shrink-0 text-right mr-4 select-none">
                    {lineNumber}
                  </span>
                  
                  {/* Code Line */}
                  <span className="flex-1 whitespace-pre-wrap">
                    {line || ' '}
                  </span>
                  
                  {/* Vulnerability Indicator */}
                  {isVulnerable && (
                    <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap size={14} className="text-yellow-400" />
                      <span className="text-xs text-gray-400">
                        {vulnerability.type}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover Tooltip */}
                  {hoveredLine === lineNumber && vulnerability && (
                    <div className="absolute left-full ml-4 top-0 z-10 bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl min-w-64">
                      <div className="text-sm">
                        <div className="font-medium text-white mb-1">
                          {vulnerability.type}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Severity: <span className="text-red-400">{vulnerability.severity}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
        
        {/* Vulnerability Summary */}
        {vulnerabilities.length > 0 && showVulnerabilities && (
          <div className="absolute top-2 right-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 border border-gray-600">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Zap size={12} className="text-yellow-400" />
              {vulnerabilities.length} issue{vulnerabilities.length !== 1 ? 's' : ''} found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};