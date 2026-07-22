import React, { useState } from 'react';
import { Code, Upload, FileText, Sparkles } from 'lucide-react';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onFileNameChange: (fileName: string) => void;
  fileName: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ 
  code, 
  onCodeChange, 
  onFileNameChange, 
  fileName 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      onFileNameChange(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onCodeChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Code className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Code Analysis
              <Sparkles size={16} className="text-yellow-500" />
            </h3>
            <p className="text-sm text-gray-600">Paste or drop your code for security analysis</p>
          </div>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Enter filename (e.g., app.js)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4">
          <div className="flex items-center justify-center mb-2">
            {isDragging ? (
              <div className="p-3 bg-blue-500 rounded-full animate-bounce">
                <Upload className="text-white" size={24} />
              </div>
            ) : (
              <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="text-gray-400" size={24} />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 text-center mb-4 font-medium">
            {isDragging ? 'Drop your file here!' : 'Drop a file here or paste your code below'}
          </p>
          
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Paste your code here for security analysis..."
            className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all duration-200 custom-scrollbar"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          />
        </div>
      </div>
    </div>
  );
};