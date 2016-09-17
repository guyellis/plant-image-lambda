.PHONY: clean

lambda:
	@if [ -z "${PLANT_IMAGE_COMPLETE}" ]; then (echo "Please export PLANT_IMAGE_COMPLETE" && exit 1); fi
	@if [ -z "${PLANT_IMAGE_HOST}" ]; then (echo "Please export PLANT_IMAGE_HOST" && exit 1); fi
	@if [ -z "${PLANT_IMAGE_PORT}" ]; then (echo "Please export PLANT_IMAGE_PORT" && exit 1); fi
	@echo "Installing node modules (production)..."
	@rm -rf node_modules/
	npm i --production --depth 0
	@echo "Copying files to build..."
	@rm -rf build/
	@mkdir build
	@cp index.js build/index.js
	@cp -R node_modules build/node_modules
	@cp -R src build/src
	sh devops/setenv.sh
	@echo "Create package archive..."
	@cd build && zip -rq lambda-image.zip .
	@mv build/lambda-image.zip ./
	@echo "Installing node modules (all)..."
	npm i --depth 0

uploadlambda: lambda
	@if [ -z "${LAMBDA_FUNCTION_NAME}" ]; then (echo "Please export LAMBDA_FUNCTION_NAME" && exit 1); fi
	aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_NAME} --zip-file fileb://lambda-image.zip

clean:
	@echo "Clean up package files"
	@if [ -f lambda-image.zip ]; then rm lambda-image.zip; fi
	@rm -rf build/*
