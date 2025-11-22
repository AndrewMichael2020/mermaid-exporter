# Mermaid Cloud Viz

An AI-powered application to visualize, create, and enhance [Mermaid.js](https://mermaid-js.github.io/mermaid/) diagrams. This project uses Next.js for the frontend and Google's Genkit for AI-powered features.

## ✨ Features

*   **Real-time Rendering**: Instantly visualize your Mermaid diagram code as you type.
*   **AI Diagram Generation**: Describe the diagram you want in plain English, and let AI generate the Mermaid code for you.
*   **AI Diagram Enhancement**: Ask the AI to modify, improve, or add to your existing diagrams.
*   **Code Editor**: A simple, clean editor for writing and editing your Mermaid syntax.
*   **Light & Dark Modes**: Switch between light and dark themes for your comfort.
*   **SVG Export**: Download your diagrams as high-quality SVG files.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **AI**: [Google Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
*   **Diagramming**: [Mermaid.js](https://mermaid-js.github.io/mermaid/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install the dependencies:
    ```bash
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

Your application should now be running at [http://localhost:9003](http://localhost:9003).

### Other Commands

*   **Build for production**:
    ```bash
    npm run build
    ```
*   **Start production server**:
    ```bash
    npm run start
    ```
*   **Lint the code**:
    ```bash
    npm run lint
    ```
