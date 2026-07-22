# SecureBot - Static Code Vulnerability Analysis

A comprehensive security analysis tool that detects vulnerabilities in source code and provides automatic fixes.

## Features

- **Static Code Analysis**: Detects SQL injection, XSS, command injection, and more
- **Automatic Code Fixes**: Intelligently applies security fixes to vulnerable code
- **Google Sign-In**: Secure authentication with Google OAuth
- **Interactive Examples**: Auto-demo with real vulnerability examples
- **Professional UI**: Clean, security-focused interface
- **JSON Export**: Download analysis results in structured format

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure Google OAuth:
   ```bash
   cp .env.example .env
   ```
4. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select existing one
   - Enable Google Identity Services
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy the client ID to your `.env` file

5. Start the development server: `npm run dev`

## Demo Access

For quick testing, use these demo credentials:
- Email: `demo@securebot.com`
- Password: `SecureBot2024!`

Or sign in with Google for a seamless experience.

## Supported Vulnerabilities

- SQL Injection (CWE-89)
- Cross-Site Scripting (CWE-79)
- Command Injection (CWE-78)
- Code Injection (CWE-94)
- Hardcoded Credentials (CWE-798)
- Weak Random Numbers (CWE-330)
- Insecure HTTP (CWE-319)
- Insecure Cookies (CWE-1004)

## Usage

1. **Login**: Use demo credentials or Google Sign-In
2. **Input Code**: Paste code or drag & drop files
3. **Analyze**: Click "Analyze Code" to detect vulnerabilities
4. **Review**: Examine findings with severity and confidence scores
5. **Fix**: Use automatic fixes to resolve security issues
6. **Export**: Download results as JSON for reporting

## Auto Examples

The application includes an auto-demo feature that cycles through real vulnerability examples, automatically analyzing each one to demonstrate the tool's capabilities.

## Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentication**: Google OAuth 2.0
- **Analysis Engine**: Custom pattern-based vulnerability detection
- **Code Fixing**: Intelligent AST-based transformations
- **Build Tool**: Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.