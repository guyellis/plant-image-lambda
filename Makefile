.PHONY: clean

lambda:
	@if [ -z "${PLANT_IMAGE_COMPLETE}" ]; then (echo "Please export PLANT_IMAGE_COMPLETE" && exit 1); fi
	@if [ -z "${PLANT_IMAGE_HOST}" ]; then (echo "Please export PLANT_IMAGE_HOST" && exit 1); fi
	@if [ -z "${PLANT_IMAGE_PORT}" ]; then (echo "Please export PLANT_IMAGE_PORT" && exit 1); fi
	@if [ -z "${LOGGLY_TOKEN}" ]; then (echo "Please export LOGGLY_TOKEN" && exit 1); fi
	@if [ -z "${LALOG_LEVEL}" ]; then (echo "Please export LALOG_LEVEL" && exit 1); fi
	@echo "Installing node modules (all)"
	npm i --depth 0
	@echo "Check Node Version"
	@npm run cnv
	@echo "Remove existing build/"
	@rm -rf build/
	@echo "Remove existing dist/"
	@rm -rf dist/
	@echo "Run TypeScript Transpiler"
	@tsc
	@echo "Create devops/env.ts"
	@ts-node devops/setenv.ts
	@echo "Transpile devops/env.ts"
	@tsc devops/env.ts --outDir dist/src/
	@echo "Remove existing node_modules"
	@rm -rf node_modules/
	@echo "Installing node modules (production)"
	npm i --production --depth 0
	@echo "Create new build/"
	@mkdir build
	@echo "Copying files to build/"
	@cp -R node_modules build/node_modules
	@cp -R dist/* build/
	@echo "Create package archive"
	@cd build && zip -rq lambda-image.zip .
	@mv build/lambda-image.zip ./
	@echo "Installing node modules (all)"
	npm i --depth 0

uploadlambda: lambda
	@if [ -z "${LAMBDA_FUNCTION_NAME}" ]; then (echo "Please export LAMBDA_FUNCTION_NAME" && exit 1); fi
	aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_NAME} --zip-file fileb://lambda-image.zip

clean:
	@echo "Clean up package files"
	@if [ -f lambda-image.zip ]; then rm lambda-image.zip; fi
	@rm -rf build/*
