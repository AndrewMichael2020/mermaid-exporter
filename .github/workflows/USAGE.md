**Usage: Reusable Workflows**

This repository provides two production-ready reusable GitHub Actions workflows to use from other repositories:

- **`reusable-ci.yml`** — runs lint, TypeScript type checks and tests.
- **`reusable-deploy-cloudrun.yml`** — builds a container with Cloud Build and deploys it to Google Cloud Run.

**Quick Overview**
- **Caller responsibility:** A repository that calls `reusable-deploy-cloudrun.yml` must provide the `GCP_SA_KEY` secret (service account key JSON) and ensure the required runtime/config secrets exist in the target GCP project's Secret Manager.
- **Where secrets live:** The deploy workflow verifies secrets exist in Google Secret Manager in the target project; it expects the secret names listed under `secrets-to-check`.

**Example: call the reusable deploy workflow**
```yaml
name: Remote Deploy
on: workflow_dispatch: {}
jobs:
  call-deploy:
    uses: AndrewMichael2020/mermaid-exporter/.github/workflows/reusable-deploy-cloudrun.yml@main
    with:
      project: YOUR_GCP_PROJECT_ID
      service: YOUR_CLOUD_RUN_SERVICE
      region: us-central1
      image-tag: ${{ github.sha }}
      secrets-to-check: |
        NEXT_PUBLIC_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_APP_ID
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        GEMINI_API_KEY
    secrets:
      GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}
```

**Required secrets and how they are used**
- **Repository secret:** `GCP_SA_KEY` — raw service account JSON (or base64-encoded JSON) used by the workflow to authenticate `gcloud`.
- **GCP Secret Manager (in the target project):** the deploy workflow checks presence of the runtime secrets listed in `secrets-to-check`. Typical defaults in this repo are the Firebase client keys and `GEMINI_API_KEY`.
 - **GCP Secret Manager (in the target project):** the deploy workflow checks presence of the runtime secrets listed in `secrets-to-check`. Typical defaults in this repo are the Firebase client keys and `GEMINI_API_KEY`.
 - **Use `:latest` for runtime secrets:** The workflows and recommended deployments map secrets using the `:latest` suffix (for example `projects/PROJECT_NUMBER/secrets/NAME:latest`). This avoids breaking autoscaled instances when older secret versions are disabled. Avoid pinning to numeric versions unless you have a specific reason.

**Provisioning & secrets — recommended quick steps**
- Create a service account for GitHub Actions and grant required roles (allow the SA to deploy Cloud Run, use Cloud Build, and access Secret Manager). Example roles: `roles/run.admin`, `roles/iam.serviceAccountUser`, `roles/cloudbuild.builds.editor`, `roles/secretmanager.secretAccessor`, `roles/storage.admin`.

Notes about runtime service accounts and Secret Manager access
- Cloud Run revisions read secrets on startup using the revision's runtime service account (often a compute service account or a custom service account). Ensure that the runtime service account has `roles/secretmanager.secretAccessor` on the secrets it must read.
- When uploading secrets, grant the runtime service account access. Example:
```bash
gcloud secrets add-iam-policy-binding NEXT_PUBLIC_FIREBASE_API_KEY \
  --project=YOUR_PROJECT \
  --member="serviceAccount:YOUR_RUNTIME_SA" \
  --role="roles/secretmanager.secretAccessor"
```

Create SA and key (example):
```bash
PROJECT=your-gcp-project-id
SA_NAME=github-actions-deployer
SA_EMAIL="${SA_NAME}@${PROJECT}.iam.gserviceaccount.com"

# create SA
gcloud iam service-accounts create "$SA_NAME" --project="$PROJECT" --display-name="GitHub Actions Deployer"

# grant roles (adjust to least privilege you need)
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:${SA_EMAIL}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:${SA_EMAIL}" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:${SA_EMAIL}" --role="roles/cloudbuild.builds.editor"
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:${SA_EMAIL}" --role="roles/secretmanager.secretAccessor"
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:${SA_EMAIL}" --role="roles/storage.admin"

# create key
gcloud iam service-accounts keys create /tmp/sa.json --iam-account="$SA_EMAIL" --project="$PROJECT"

# Upload raw JSON into GitHub repo secret
gh secret set GCP_SA_KEY --repo "OWNER/REPO" --body "$(cat /tmp/sa.json)"
rm -f /tmp/sa.json
```

**Upload runtime secrets into GCP Secret Manager (from `.env.local`)**
- This repo includes `scripts/upload-secrets.sh` which reads a local `.env.local` and creates/updates the secrets in Secret Manager and grants access to your backend.

Usage (example):
```bash
# Set PROJECT or pass --project
./scripts/upload-secrets.sh --project your-gcp-project-id --env-file .env.local
```

Notes:
- The script will skip placeholder values and will not print secret contents.
- After upload the deploy workflow should find secrets in Secret Manager and proceed.

**Triggering the reusable deploy workflow**
- From caller repo you can:
  - Use the GitHub UI: Actions → pick the workflow → Run workflow.
  - Use `gh`: `gh workflow run main.yml --repo "OWNER/REPO" --ref main` (requires token with `workflow` scope or an account with repo admin).
  - Push to the branch configured to trigger the caller workflow (e.g., `main`) — the repo caller's event must match the `on:` of the caller workflow.

**Common errors and how to fix them**
- `Service account key is neither valid JSON nor valid base64-encoded JSON.` — re-create the `GCP_SA_KEY` repo secret with either the raw JSON or a single-line base64-encoded JSON. Example to upload raw JSON: `gh secret set GCP_SA_KEY --repo OWNER/REPO --body "$(cat /tmp/sa.json)"`.
- `Missing secrets in Secret Manager:` — ensure the listed secret names exist in the target project. Use `gcloud secrets list --project=YOUR_PROJECT` and `gcloud secrets versions access latest --secret=NAME --project=YOUR_PROJECT` to verify.
- `403: Resource not accessible by integration` when using `gh workflow run` — the token used must have the `workflow` scope or be a user token with repo permissions; use the GitHub UI or a PAT with `workflow` scope.

**Verifying a deployment**
- Get the Cloud Run service URL:
  ```bash
  gcloud run services describe SERVICE_NAME --project=PROJECT --region=REGION --platform=managed --format='value(status.url)'
  ```
- View Cloud Build logs in Cloud Console or via `gcloud builds list` and `gcloud builds describe BUILD_ID`.
- Inspect GitHub Actions logs in the Actions UI or via `gh run view <run-id> --repo OWNER/REPO --log`.

**Security & cleanup**
- Remove any local copies of service account keys after uploading: `rm -f /tmp/sa.json`.
- Rotate and revoke keys regularly. To delete a key: `gcloud iam service-accounts keys delete KEY_ID --iam-account="$SA_EMAIL"`.
- After deployment reduce IAM privileges to least-privilege necessary.

If you'd like, I can:
- run `./scripts/upload-secrets.sh --project <PROJECT> --env-file .env.local` here (you already ran it successfully),
- recreate or rotate the `GCP_SA_KEY` and upload it, or
- trigger the deploy workflow and stream logs for you.

---

File location: `.github/workflows/reusable-deploy-cloudrun.yml` and `scripts/upload-secrets.sh` contain the canonical deploy logic and helper scripts; follow this `USAGE.md` for a smooth workflow.
Usage: Reusable Workflows

This repository exposes two reusable workflows in `.github/workflows/`:

- `reusable-ci.yml` — a reusable CI workflow that runs lint, type checking and tests.
- `reusable-deploy-cloudrun.yml` — a reusable build + deploy workflow for Google Cloud Run.

Calling from another repository

Example caller that invokes the reusable CI workflow from another repo:

```yaml
name: Remote CI
on: [push]
jobs:
  call-ci:
    uses: AndrewMichael2020/mermaid-exporter/.github/workflows/reusable-ci.yml@main
    with:
      node-version: '20'
      run-lint: true
      run-typecheck: true
      run-tests: true
```

Example caller that invokes the reusable deploy workflow:
 
```yaml
name: Remote Deploy
on:
  workflow_dispatch: {}
jobs:
  call-deploy:
    uses: AndrewMichael2020/mermaid-exporter/.github/workflows/reusable-deploy-cloudrun.yml@main
    with:
      project: YOUR_GCP_PROJECT_ID
      service: YOUR_CLOUD_RUN_SERVICE
      region: us-central1
      image-tag: ${{ github.sha }}
      secrets-to-check: |
        NEXT_PUBLIC_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_APP_ID
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        GEMINI_API_KEY
    secrets:
      GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}

Notes and requirements
- When calling reusable workflows from a different repository, include a `@ref` (branch/tag/sha) on the `uses` string.
- Secrets must be supplied by the caller repository (or at the org level). The deploy workflow requires a `GCP_SA_KEY` repository secret containing a service account key JSON that can administer Cloud Run and Cloud Build.
- The deploy workflow verifies secrets exist in Google Secret Manager within the target GCP project. Ensure the service account used by `GCP_SA_KEY` has `secretmanager.versions.access` and `secretmanager.secrets.get` as needed.
- Do not commit sensitive values (API keys, JSON keys) into the repository. Use repository or organization secrets instead.

Setting GitHub secrets from your local `.env.local`

This repo includes a helper script `scripts/set-github-secrets.sh` that reads key/value pairs from a local `.env.local` file (same format as `.env.local.example`) and sets them as GitHub secrets either at the organization level or per-repository.

Quick steps:

1. Copy `.env.local.example` to `.env.local` and fill in the real values locally (do NOT commit this file):

```bash
cp .env.local.example .env.local
# edit .env.local locally
```

2. Prepare a list of target repositories if setting per-repo secrets. Use `scripts/repos.txt.sample` as a starting point and copy it:

```bash
cp scripts/repos.txt.sample scripts/repos.txt
# edit scripts/repos.txt to include all target owner/repo lines
```

3. Authorize `gh` CLI and ensure you have the required permissions:

```bash
gh auth login
# For org secrets you need org admin (or equivalent) privileges
# For repo secrets you need admin rights on each target repo
```

4. Dry-run to see what will be executed:

```bash
./scripts/set-github-secrets.sh --env .env.local --repos-file scripts/repos.txt --dry-run
```

5. Run to set secrets per-repo or at org level:

# Set per-repo secrets from the repos file:
```bash
./scripts/set-github-secrets.sh --env .env.local --repos-file scripts/repos.txt
```

# Or set as org secrets (all repos in the org):
```bash
./scripts/set-github-secrets.sh --env .env.local --org my-org
```

Notes:
- The script uses the `gh secret set` command which is safe (it transmits secrets to GitHub) but does not persist secret values in the repository.
- If you want org-level secrets restricted to selected repositories, pass `--org` and `--repos-file` together.
- Always run the script with `--dry-run` first to confirm targets.

