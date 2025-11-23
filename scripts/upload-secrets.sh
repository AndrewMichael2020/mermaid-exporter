#!/usr/bin/env bash
set -euo pipefail

# Change these if needed
PROJECT="studio-1697788595-a34f5"
BACKEND="mermaid-exporter"
ENVFILE=".env.local"

secrets=(
  "GEMINI_API_KEY"
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  "NEXT_PUBLIC_FIREBASE_APP_ID"
)

if [ ! -f "$ENVFILE" ]; then
  echo "Error: $ENVFILE not found. Place it in the current working directory." >&2
  exit 2
fi

for name in "${secrets[@]}"; do
  # Extract first matching line value (supports values without quotes)
  raw=$(grep -m1 -E "^${name}=" "$ENVFILE" || true)
  if [ -z "$raw" ]; then
    echo "Skipping ${name}: not found in $ENVFILE"
    continue
  fi

  # Remove NAME= prefix
  value="${raw#${name}=}"

  echo "==> Creating/Updating secret: ${name}"

  # Create the secret if it doesn't exist
  if ! gcloud secrets describe "${name}" --project="$PROJECT" >/dev/null 2>&1; then
    gcloud secrets create "${name}" \
      --replication-policy="automatic" \
      --project="$PROJECT"
  fi

  # Add the secret version (read via stdin)
  printf '%s' "$value" | gcloud secrets versions add "${name}" --data-file=- --project="$PROJECT"

  # Grant App Hosting backend access so build/runtime can read the secret
  # (This uses the firebase CLI helper you've used previously)
  firebase apphosting:secrets:grantaccess "${name}" --backend="$BACKEND" --project="$PROJECT" || true

  echo "  -> Uploaded and granted access for ${name}"
done

echo "Done. Verify with: gcloud secrets list --project=$PROJECT"