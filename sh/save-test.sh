#!/bin/bash

RUNNER_OS=LINUX
FILE_HASH=ABRACADABRA
TARGET_LANG=nodejs
SAVE_PATH="./node_modules\n./package-lock.json"

npm run dev:save --\
  --path="${SAVE_PATH}" \
  --key="${RUNNER_OS}-${TARGET_LANG}-${FILE_HASH}" \
  --restore-keys="${RUNNER_OS}-${TARGET_LANG}-\n${RUNNER_OS}-"
