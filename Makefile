develop:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test -s

lint:
	npx eslint .

lint_fix:
	npx eslint --fix .

.PHONY: test
