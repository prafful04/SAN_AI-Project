import React from 'react';
import { FileCode, Copy } from 'lucide-react';

interface ExampleCodeProps {
  onLoadExample: (code: string, fileName: string) => void;
}

const examples = [
  {
    name: 'SQL Injection Vulnerability',
    fileName: 'vulnerable-query.js',
    code: `// Vulnerable SQL query
const userId = req.params.id;
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
db.query(query, (err, results) => {
  res.json(results);
});

// This allows injection like: /users/1; DROP TABLE users--`
  },
  {
    name: 'XSS Vulnerability',
    fileName: 'vulnerable-dom.js',
    code: `// Vulnerable DOM manipulation
const userComment = req.body.comment;
const commentDiv = document.getElementById('comments');
commentDiv.innerHTML += \`<div class="comment">\${userComment}</div>\`;

// This allows XSS like: <script>alert('XSS')</script>`
  },
  {
    name: 'Command Injection',
    fileName: 'vulnerable-exec.js',
    code: `const { exec } = require('child_process');
const userInput = req.query.filename;

// Vulnerable command execution
exec(\`cat \${userInput}\`, (error, stdout, stderr) => {
  res.send(stdout);
});

// Allows injection like: file.txt; rm -rf /`
  },
  {
    name: 'Hardcoded Credentials',
    fileName: 'config.js',
    code: `// Hardcoded secrets (bad practice)
const config = {
  database: {
    host: 'localhost',
    user: 'admin',
    password: 'super_secret_password_123',
    port: 5432
  },
  api_key: 'sk_live_abcd1234567890',
  jwt_secret: 'my-super-secret-key'
};

module.exports = config;`
  },
  {
    name: 'Multiple Vulnerabilities',
    fileName: 'vulnerable-app.js',
    code: `const express = require('express');
const { exec } = require('child_process');
const app = express();

// Multiple security issues
app.get('/search', (req, res) => {
  const query = req.query.q;
  
  // SQL Injection
  const sql = \`SELECT * FROM products WHERE name LIKE '%\${query}%'\`;
  
  // XSS vulnerability
  document.getElementById('results').innerHTML = \`<h2>Results for: \${query}</h2>\`;
  
  // Command injection
  exec(\`grep -r "\${query}" ./files/\`, (err, stdout) => {
    res.send(stdout);
  });
  
  // Insecure random for session
  const sessionId = Math.random().toString(36);
  
  // Insecure cookie
  res.cookie('session', sessionId, { httpOnly: false });
});

// Hardcoded API key
const API_KEY = 'sk_test_1234567890abcdef';`
  }
];

export const ExampleCode: React.FC<ExampleCodeProps> = ({ onLoadExample }) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-700">
        <FileCode size={20} />
        <h3 className="font-semibold">Example Vulnerable Code</h3>
      </div>
      
      <div className="grid gap-3">
        {examples.map((example, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{example.name}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(example.code)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy code"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => onLoadExample(example.code, example.fileName)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Load Example
                </button>
              </div>
            </div>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto text-gray-700 font-mono">
              {example.code.split('\n').slice(0, 3).join('\n')}...
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};