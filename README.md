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

## ☁️ Deploy to Cloud Run (via GitHub Actions)

This repository includes a GitHub Actions workflow in `.github/workflows/deploy-cloudrun.yml` that builds a container using Cloud Build and deploys it to Cloud Run.

**For comprehensive deployment instructions, see [docs/deployment.md](docs/deployment.md).**

### Quick Start

Prerequisites:
- A GCP project with Cloud Run enabled
- A GCP service account key with the roles: `Cloud Run Admin`, `Cloud Build Editor`, `Service Account User`, and `Secret Manager Secret Accessor`
- GitHub Secrets configured for the repository: `GCP_PROJECT`, `GCP_SA_KEY` (the service account JSON), `CLOUD_RUN_SERVICE`, `CLOUD_RUN_REGION`.

Steps:
1. Create runtime secrets in Secret Manager (e.g. `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `GEMINI_API_KEY`, etc.)
2. Grant access to your Cloud Run service account for Secret Manager (Secret Manager -> Add Member -> serviceAccount:<SERVICE_ACCOUNT_EMAIL> -> Secret Manager Secret Accessor)
3. Configure the GitHub Actions secrets listed above in your repository settings
4. Push to `main` – the workflow will build the image and deploy it to Cloud Run using the secrets mapped at runtime via `--update-secrets`.

### Local Deployment with Cloud Build

You can also deploy directly using Cloud Build:

```sh
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=mermaid-exporter,_REGION=us-central1
```

### Uploading Secrets

If you want to upload your local `.env.local` values directly to Secret Manager, you can run the helper script (ensure you have the Google Cloud SDK configured and the right permissions):

```sh
./scripts/upload-secrets.sh --project <GCP_PROJECT> --env-file .env.local
```

Notes:
- Client-side Firebase config is fetched from `/api/public-config` at runtime (the server reads `NEXT_PUBLIC_FIREBASE_*` env vars) so the public keys are not embedded at build time.
- Keep Secrets out of git history; remove any inadvertent commits and rotate compromised keys using GCP Secret Manager and/or GitHub repository settings.

If you have accidentally committed build artifacts or `.env.local` with secrets, you should remove them from git history and rotate the exposed keys. Example commands:

```sh
# Remove sensitive files from the current branch
git rm -r --cached .next
git rm --cached .env.local
git commit -m "chore: remove build artifacts and sensitive files from repo"
git push

# To rewrite history, consider using the BFG Repo-Cleaner or git filter-repo, then rotate keys and secrets in GCP.
``` 

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
