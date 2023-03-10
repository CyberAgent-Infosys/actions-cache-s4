#!/bin/bash

RUNNER_OS=LINUX
FILE_HASH=ABRACADABRA
TARGET_LANG=nodejs
SAVE_PATH="./node_modules\n./package-lock.json"

npm run dev:restore --\
  --path="${SAVE_PATH}" \
  --key="${RUNNER_OS}-${TARGET_LANG}-${FILE_HASH}" \
  --restore-keys="${RUNNER_OS}-${TARGET_LANG}-\n${RUNNER_OS}-" \
  --aws-s3-bucket="${AWS_S3_BUCKET_NAME}" \
  --aws-access-key-id="${AWS_ACCESS_KEY_ID}" \
  --aws-secret-access-key="${AWS_SECRET_ACCESS_KEY}"
