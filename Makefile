NPM_BIN="$(shell npm root)/.bin"
OUT_DIR="./src/gen"

# ツールのパス
NODE_PROTOC=$(NPM_BIN)/grpc_tools_node_protoc
NODE_PROTOC_PLUGIN="$(NPM_BIN)/grpc_tools_node_protoc_plugin"
PROTOC_GEN_TS="$(NPM_BIN)/protoc-gen-ts"

.PHONY: gen
gen:
	rm -rf $(OUT_DIR) && mkdir -p $(OUT_DIR)
	$(NODE_PROTOC) \
		--plugin="protoc-gen-ts=$(PROTOC_GEN_TS)" \
		--js_out="import_style=commonjs,binary:$(OUT_DIR)" \
		--grpc_out="grpc_js:$(OUT_DIR)" \
		--ts_out="service=grpc-node,mode=grpc-js:$(OUT_DIR)" \
		-I ./ \
		./proto/*.proto
