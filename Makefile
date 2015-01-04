all: node_modules build

build: index.js
	node index.js
	rm -rf build/electronics build/music

node_modules: package.json
	npm install

.PHONY: build
