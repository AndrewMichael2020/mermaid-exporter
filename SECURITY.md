# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.

## Handling Secrets

If you find that secrets or API keys were committed to the repository (including in `.env.local` or build artifacts under `.next/`), please do the following immediately:

1. Rotate the affected secrets (rotate API keys in the provider console such as Google Cloud Console or your API provider).
2. Remove the secret and any committed build artifacts that contain them from the repository's history. You can use tools like `git filter-repo` or the BFG Repo-Cleaner to scrub the history.
3. Ensure `.env.local` and `.next` are in `.gitignore` and not committed going forward.
4. Use Secret Manager (e.g., Google Secret Manager) and configure deployment-only mappings (e.g., Cloud Run `--update-secrets`) so secrets are not embedded at build-time.
