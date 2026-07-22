import React, { useState, useEffect } from 'react';
import { Github, GitBranch, FileText, AlertTriangle, CheckCircle, Download, Upload } from 'lucide-react';
import { GitHubService, GitHubRepo, GitHubFile } from '../utils/githubApi';
import { SecurityAnalyzer } from '../utils/securityAnalyzer';
import { CodeFixer } from '../utils/codeFixer';
import { AnalysisResult } from '../types/security';

interface GitHubIntegrationProps {
  onLoadCode: (code: string, fileName: string) => void;
  onAnalysisComplete: (results: AnalysisResult) => void;
}

export const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ 
  onLoadCode, 
  onAnalysisComplete 
}) => {
  const [githubToken, setGithubToken] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Map<string, AnalysisResult>>(new Map());
  const [error, setError] = useState('');

  const githubService = githubToken ? new GitHubService(githubToken) : null;
  const securityAnalyzer = new SecurityAnalyzer();
  const codeFixer = new CodeFixer();

  // Parse GitHub repository URL
  const parseRepoUrl = (url: string): GitHubRepo | null => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', ''),
      };
    }
    return null;
  };

  // Connect to GitHub
  const connectToGitHub = async () => {
    if (!githubToken) {
      setError('Please enter your GitHub token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const service = new GitHubService(githubToken);
      const repos = await service.getUserRepositories();
      setRepositories(repos);
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect to GitHub. Please check your token.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load repository files
  const loadRepository = async (repo: GitHubRepo) => {
    if (!githubService) return;

    setIsLoading(true);
    setError('');
    setSelectedRepo(repo);

    try {
      const repoFiles = await githubService.getRepositoryFiles(repo.owner, repo.repo);
      setFiles(repoFiles);
      
      // Automatically analyze all files
      const results = new Map<string, AnalysisResult>();
      for (const file of repoFiles) {
        const analysis = securityAnalyzer.analyze(file.content, file.path);
        if (analysis.findings.length > 0) {
          results.set(file.path, analysis);
        }
      }
      setAnalysisResults(results);
    } catch (err) {
      setError('Failed to load repository files');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load repository from URL
  const loadFromUrl = async () => {
    const repo = parseRepoUrl(repoUrl);
    if (!repo) {
      setError('Invalid GitHub repository URL');
      return;
    }

    await loadRepository(repo);
  };

  // Create security fix pull request
  const createSecurityPR = async () => {
    if (!githubService || !selectedRepo || analysisResults.size === 0) return;

    setIsLoading(true);
    setError('');

    try {
      const branchName = `security-fixes-${Date.now()}`;
      
      // Create new branch
      await githubService.createBranch(selectedRepo.owner, selectedRepo.repo, branchName);

      let totalFixes = 0;
      const fixedFiles: string[] = [];

      // Apply fixes to each vulnerable file
      for (const [filePath, results] of analysisResults.entries()) {
        const file = files.find(f => f.path === filePath);
        if (!file) continue;

        const fixedCode = codeFixer.generateFixedCodeWithComments(file.content, results.findings);
        
        await githubService.updateFile(
          selectedRepo.owner,
          selectedRepo.repo,
          filePath,
          fixedCode,
          `Fix security vulnerabilities in ${filePath}`,
          file.sha,
          branchName
        );

        totalFixes += results.findings.length;
        fixedFiles.push(filePath);
      }

      // Create pull request
      const prBody = `
## 🔒 Security Vulnerability Fixes

This PR automatically fixes **${totalFixes} security vulnerabilities** detected by SecureBot analysis.

### Files Modified:
${fixedFiles.map(file => `- \`${file}\``).join('\n')}

### Vulnerabilities Fixed:
${Array.from(analysisResults.values()).flatMap(r => r.findings).map(f => 
  `- **${f.type}** (${f.cwe}) - ${f.severity} severity`
).join('\n')}

### ⚠️ Important Notes:
- Please review all changes carefully before merging
- Test the application thoroughly in a development environment
- Some fixes may require additional configuration (environment variables, etc.)
- Consider implementing the suggested unit tests for each fix

---
*Generated by SecureBot - Static Code Vulnerability Analysis*
      `;

      const pr = await githubService.createPullRequest(
        selectedRepo.owner,
        selectedRepo.repo,
        `🔒 Fix ${totalFixes} security vulnerabilities`,
        prBody,
        branchName
      );

      alert(`Security fix PR created successfully! PR #${pr.number}`);
    } catch (err) {
      setError('Failed to create security fix PR');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load file into main editor
  const loadFileIntoEditor = (file: GitHubFile) => {
    onLoadCode(file.content, file.name);
    const analysis = securityAnalyzer.analyze(file.content, file.path);
    onAnalysisComplete(analysis);
  };

  const totalVulnerabilities = Array.from(analysisResults.values())
    .reduce((sum, result) => sum + result.findings.length, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Github className="text-gray-700" size={20} />
        <h3 className="font-semibold text-gray-900">GitHub Integration</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Create a token at GitHub Settings → Developer settings → Personal access tokens
            </p>
          </div>

          <button
            onClick={connectToGitHub}
            disabled={isLoading || !githubToken}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Github size={16} />
            )}
            Connect to GitHub
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Repository URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={loadFromUrl}
                disabled={isLoading || !repoUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Load
              </button>
            </div>
          </div>

          {/* Repository Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Repositories
            </label>
            <select
              onChange={(e) => {
                const repo = repositories.find(r => r.full_name === e.target.value);
                if (repo) {
                  loadRepository({ owner: repo.owner.login, repo: repo.name });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a repository...</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name} {repo.private ? '(Private)' : '(Public)'}
                </option>
              ))}
            </select>
          </div>

          {/* Analysis Results */}
          {selectedRepo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-gray-600" />
                  <span className="font-medium">{selectedRepo.owner}/{selectedRepo.repo}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {files.length} files analyzed
                  </span>
                  {totalVulnerabilities > 0 && (
                    <span className="flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle size={14} />
                      {totalVulnerabilities} vulnerabilities
                    </span>
                  )}
                </div>
              </div>

              {/* Vulnerable Files List */}
              {analysisResults.size > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Vulnerable Files</h4>
                    <button
                      onClick={createSecurityPR}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      <Upload size={14} />
                      Create Fix PR
                    </button>
                  </div>
                  
                  {Array.from(analysisResults.entries()).map(([filePath, results]) => (
                    <div key={filePath} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-600" />
                          <span className="font-medium text-gray-900">{filePath}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-600">
                            {results.findings.length} issues
                          </span>
                          <button
                            onClick={() => {
                              const file = files.find(f => f.path === filePath);
                              if (file) loadFileIntoEditor(file);
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Analyze
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {results.findings.map((finding, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            • {finding.type} ({finding.severity}) - Line {finding.line_start}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Clean Files */}
              {files.length > analysisResults.size && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Clean Files ({files.length - analysisResults.size})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {files
                      .filter(file => !analysisResults.has(file.path))
                      .map((file) => (
                        <div key={file.path} className="text-sm text-gray-600 truncate">
                          {file.path}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}
    </div>
  );
};