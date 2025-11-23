# Mermaid Cloud Viz

An AI-powered application to visualize, create, and enhance [Mermaid.js](https://mermaid-js.github.io/mermaid/) diagrams. This project uses Next.js for the frontend and Google's Genkit for AI-powered features.

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

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
