all: node_modules build

build: index.js
	node index.js

node_modules: package.json
	npm install

.PHONY: build
