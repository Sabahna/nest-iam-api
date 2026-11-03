#!/usr/bin/env bash
set -euo pipefail

PROTO_ROOT=./node_modules/sm-protobuf/proto
PROTO_FILES=()
while IFS= read -r file; do
  PROTO_FILES+=("$file")
done < <(find "$PROTO_ROOT/iam" -type f -name '*.proto' ! -name 'iam.proto' | sort)

if [ ${#PROTO_FILES[@]} -eq 0 ]; then
  echo "No IAM proto files found under $PROTO_ROOT/iam" >&2
  exit 1
fi

mkdir -p src/protobuf

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  -I "$PROTO_ROOT" \
  "${PROTO_FILES[@]}" \
  --ts_proto_out=src/protobuf/ \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=fileSuffix=.pb \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=snakeToCamel=false \
  --ts_proto_opt=useOptionals=none
