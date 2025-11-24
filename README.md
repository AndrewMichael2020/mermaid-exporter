# Mermaid Cloud Viz

An AI-powered application to visualize, create, and enhance [Mermaid.js](https://mermaid-js.github.io/mermaid/) diagrams. This project uses Next.js for the frontend and Google's Genkit for AI-powered features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/AndrewMichael2020/mermaid-exporter)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Security: No Vulnerabilities](https://img.shields.io/badge/security-no%20vulnerabilities-brightgreen.svg)](https://github.com/AndrewMichael2020/mermaid-exporter/security)
[![Code Coverage](https://img.shields.io/badge/coverage-97.58%25-brightgreen.svg)](https://github.com/AndrewMichael2020/mermaid-exporter)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/AndrewMichael2020/mermaid-exporter)

![Mermaid Cloud Viz Screenshot](docs/gallery-1.png)

## ✨ Core Features

*   **Instant Rendering**: Instantly visualize your Mermaid diagram code as you type.
*   **AI Diagram Generation**: Describe the diagram you want in plain English, and let AI generate the Mermaid code for you.
*   **AI Diagram Enhancement**: Ask the AI to modify, improve, or add to your existing diagrams.
*   **Diagram Gallery**: Explore a rich gallery of pre-built, healthcare-focused diagram examples to get started quickly.
*   **SVG Export**: Download your diagrams as high-quality SVG files with clean margins.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js (v18 or later) and npm installed on your machine.

*   **npm**
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/AndrewMichael2020/mermaid-exporter.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

## 🏃 Running the Application

This application requires two services to be running concurrently: the Next.js frontend and the Genkit AI server.

1.  **Start the Genkit AI server:**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```

2.  **Start the Next.js development server:**
    Open a *second* terminal and run:
    ```bash
    npm run dev
    ```

Your application should now be running at [http://localhost:9005](http://localhost:9005).

## 🔒 Security

Security is a priority for this project. If you discover any security vulnerabilities, please review our [Security Policy](SECURITY.md) for information on how to report them responsibly.

### Quick Security Tips
- Never commit API keys or credentials
- Keep dependencies updated with `npm audit fix`
- Use environment variables for sensitive configuration
- Review the [Security Policy](SECURITY.md) for deployment best practices

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
