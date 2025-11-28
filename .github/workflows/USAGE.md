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

