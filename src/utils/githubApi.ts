// GitHub API integration utilities
export interface GitHubRepo {
  owner: string;
  repo: string;
  branch?: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  content: string;
  sha: string;
  size: number;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
}

export class GitHubService {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get repository information
  async getRepository(owner: string, repo: string) {
    return this.makeRequest(`/repos/${owner}/${repo}`);
  }

  // Get file content from repository
  async getFileContent(owner: string, repo: string, path: string, branch = 'main'): Promise<GitHubFile> {
    const response = await this.makeRequest(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    
    if (response.type !== 'file') {
      throw new Error('Path is not a file');
    }

    const content = atob(response.content.replace(/\n/g, ''));
    
    return {
      name: response.name,
      path: response.path,
      content,
      sha: response.sha,
      size: response.size,
    };
  }

  // Get multiple files from repository
  async getRepositoryFiles(owner: string, repo: string, branch = 'main', path = ''): Promise<GitHubFile[]> {
    const response = await this.makeRequest(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    const files: GitHubFile[] = [];

    for (const item of response) {
      if (item.type === 'file' && this.isAnalyzableFile(item.name)) {
        try {
          const fileContent = await this.getFileContent(owner, repo, item.path, branch);
          files.push(fileContent);
        } catch (error) {
          console.warn(`Failed to fetch ${item.path}:`, error);
        }
      } else if (item.type === 'dir') {
        // Recursively get files from subdirectories
        const subFiles = await this.getRepositoryFiles(owner, repo, branch, item.path);
        files.push(...subFiles);
      }
    }

    return files;
  }

  // Check if file should be analyzed
  private isAnalyzableFile(filename: string): boolean {
    const analyzableExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.php', '.java', '.cs', '.cpp', '.c',
      '.go', '.rb', '.swift', '.kt', '.scala', '.sql', '.sh', '.bash'
    ];
    
    return analyzableExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  // Create a new branch
  async createBranch(owner: string, repo: string, newBranch: string, fromBranch = 'main') {
    // Get the SHA of the source branch
    const refResponse = await this.makeRequest(`/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`);
    const sha = refResponse.object.sha;

    // Create new branch
    return this.makeRequest(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: sha,
      }),
    });
  }

  // Update file content
  async updateFile(
    owner: string, 
    repo: string, 
    path: string, 
    content: string, 
    message: string, 
    sha: string, 
    branch = 'main'
  ) {
    return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(content),
        sha,
        branch,
      }),
    });
  }

  // Create pull request
  async createPullRequest(
    owner: string, 
    repo: string, 
    title: string, 
    body: string, 
    head: string, 
    base = 'main'
  ): Promise<GitHubPullRequest> {
    return this.makeRequest(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    });
  }

  // Get pull requests
  async getPullRequests(owner: string, repo: string, state = 'open') {
    return this.makeRequest(`/repos/${owner}/${repo}/pulls?state=${state}`);
  }

  // Add comment to pull request
  async addPullRequestComment(owner: string, repo: string, pullNumber: number, body: string) {
    return this.makeRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  // Search repositories
  async searchRepositories(query: string, sort = 'updated', order = 'desc') {
    return this.makeRequest(`/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}`);
  }

  // Get user repositories
  async getUserRepositories(username?: string) {
    const endpoint = username ? `/users/${username}/repos` : '/user/repos';
    return this.makeRequest(endpoint);
  }
}