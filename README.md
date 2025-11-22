# Mermaid Cloud Viz

An AI-powered application to visualize, create, and enhance [Mermaid.js](https://mermaid-js.github.io/mermaid/) diagrams. This project uses Next.js for the frontend and Google's Genkit for AI-powered features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Genkit](https://img.shields.io/badge/Genkit-2391ff?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)


## ✨ Features

*   **Instant Rendering**: Instantly visualize your Mermaid diagram code as you type.
*   **AI Diagram Generation**: Describe the diagram you want in plain English, and let AI generate the Mermaid code for you.
*   **AI Diagram Enhancement**: Ask the AI to modify, improve, or add to your existing diagrams.
*   **Code Editor**: A simple, clean editor for writing and editing your Mermaid syntax.
*   **Light & Dark Modes**: Switch between light and dark themes for your comfort.
*   **SVG Export**: Download your diagrams as high-quality SVG files.

## 🛠️ Built With

*   [Next.js](https://nextjs.org/) - The React framework for the web.
*   [Google Genkit](https://firebase.google.com/docs/genkit) - The AI framework for building generative AI applications.
*   [React](https://react.dev/) - A JavaScript library for building user interfaces.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
*   [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable components built using Radix UI and Tailwind CSS.
*   [Mermaid.js](https://mermaid-js.github.io/mermaid/) - A JavaScript based diagramming and charting tool.
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.

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

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
