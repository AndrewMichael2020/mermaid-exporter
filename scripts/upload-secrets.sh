#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/upload-secrets.sh --project <GCP_PROJECT> --env-file .env.local
PROJECT=${1:-$(gcloud config get-value project 2>/dev/null || echo "")}
ENV_FILE=${2:-.env.local}

if [ -z "$PROJECT" ]; then
  echo "ERROR: Please provide a GCP project via argument or 'gcloud config set project'"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: env file $ENV_FILE not found"
  exit 1
fi

echo "Using project: $PROJECT"

set -a
source $ENV_FILE
set +a

# Helper to create/update secret if value present and not placeholder
upload_secret() {
  local name="$1"
  local val="$2"
  if [ -z "$val" ] || [[ "$val" == REPLACE_WITH_* ]] || [[ "$val" == YOUR_* ]] ; then
    echo "Skipping $name because it appears to be a placeholder or empty"
    return
  fi

  if gcloud secrets list --filter="name:${name}" --project "$PROJECT" --format="value(name)" | grep -q "${name}"; then
    echo "Adding new secret version for ${name}"
    echo -n "$val" | gcloud secrets versions add "${name}" --data-file=- --project "$PROJECT" --quiet
  else
    echo "Creating secret ${name}"
    echo -n "$val" | gcloud secrets create "${name}" --data-file=- --project "$PROJECT" --replication-policy="automatic" --quiet
  fi
}

# Upload core secrets used by the runtime
upload_secret "NEXT_PUBLIC_FIREBASE_API_KEY" "$NEXT_PUBLIC_FIREBASE_API_KEY"
upload_secret "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "$NEXT_PUBLIC_FIREBASE_PROJECT_ID"
upload_secret "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
upload_secret "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
upload_secret "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
upload_secret "NEXT_PUBLIC_FIREBASE_APP_ID" "$NEXT_PUBLIC_FIREBASE_APP_ID"
upload_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"

echo "Secrets uploaded to project: $PROJECT"
