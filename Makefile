BUILD_DIR=build
BUILT_SITE_DIR=../bridadan.github.io
CURRENT_DR=$PWD

all: node_modules build

build: index.js
	node index.js

deploy:
	@# Make sure build directory exists
	@if ! test -d $(BUILD_DIR); \
	then echo "Build directory \"$(BUILD_DIR)\" not found. Run \"make build\"." && exit 1; \
	fi

	@# Make sure built site repository exists
	@if ! test -d $(BUILT_SITE_DIR); \
	then echo "Built site directory \"$(BUILT_SITE_DIR)\" not found. Clone repository first." && exit 1; \
	fi

	@# Copy built site into built site repository
	@rm -rf $(BUILT_SITE_DIR)/*
	@cp -avr $(BUILD_DIR)/* $(BUILT_SITE_DIR) > /dev/null
	@echo "Files copied. Commit changes in \"$(BUILT_SITE_DIR)\" and push."


node_modules: package.json
	npm install

.PHONY: build
