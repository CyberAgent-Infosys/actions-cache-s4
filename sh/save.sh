RUNNER_OS=LINUX
FILE_HASH=ABRACADABRA

npm run dev --\
  --path="./node_modules\n./package-lock.json" \
  --key="${RUNNER_OS}-nodejs-${FILE_HASH}" \
  --restore-keys="${RUNNER_OS}-nodejs-\n${RUNNER_OS}-" \
  --aws-s3-bucket=${AWS_S3_BUCKET_NAME} \
  --aws-access-key-id=${AWS_ACCESS_KEY_ID} \
  --aws-secret-access-key=${AWS_SECRET_ACCESS_KEY} \
  --aws-region=${AWS_REGION} \
  --aws-endpoint=${AWS_ENDPOINT} \
  --aws-s3-bucket-endpoint=false \
  --aws-s3-force-path-style=true
