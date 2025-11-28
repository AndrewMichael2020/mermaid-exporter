# Security Policy

## Supported Versions

The following versions of Mermaid Cloud Viz are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

As this project is in early development (v0.1.x), we maintain security support for the latest minor version only. We recommend always using the latest version for the best security posture.

## Security Best Practices

This project follows security best practices including:

- **Dependency Management**: Regular dependency audits via `npm audit` in CI/CD pipelines
- **Secret Management**: All sensitive configuration (API keys, Firebase credentials) are managed through environment variables and GitHub Secrets, never committed to source code
- **Authentication**: Application access is secured via Google Authentication
- **Infrastructure**: Deployed on Firebase App Hosting with Cloud Run backend, leveraging Google Cloud's security infrastructure
- **Code Quality**: Automated linting, type checking, and testing on all pull requests

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email the security concern to the repository maintainers directly
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Assessment**: We will assess the vulnerability and determine its severity within 7 days
- **Updates**: You will receive updates on our progress at least every 7 days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days
- **Credit**: With your permission, we will credit you in the security advisory

### Vulnerability Disclosure Policy

- We follow coordinated disclosure practices
- We request that you do not publicly disclose the vulnerability until we have had a reasonable opportunity to address it
- We will work with you to understand and resolve the issue quickly

## Security Updates

Security updates are released as patch versions. Subscribe to repository releases to be notified of security patches.

## Dependencies

This project uses the following key dependencies that handle sensitive operations:

- **Firebase SDK**: Authentication and cloud services
- **Genkit AI**: AI-powered features with Google's Gemini API
- **Next.js**: Server-side rendering and API routes

We monitor these dependencies for security advisories and update promptly when patches are available.
