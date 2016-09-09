.PHONY: clean

lambda:
	@echo "Installing node modules (production)..."
	@rm -rf node_modules/
	npm i --production
	@echo "Copying files to build..."
	@rm -rf build/
	@mkdir build
	@cp index.js build/index.js
	@cp -R node_modules build/node_modules
	@echo "Create package archive..."
	@cd build && zip -rq lambda-image.zip .
	@mv build/lambda-image.zip ./

uploadlambda: lambda
	@if [ -z "${LAMBDA_FUNCTION_NAME}" ]; then (echo "Please export LAMBDA_FUNCTION_NAME" && exit 1); fi
	aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_NAME} --zip-file fileb://lambda-image.zip

clean:
	@echo "Clean up package files"
	@if [ -f lambda-image.zip ]; then rm lambda-image.zip; fi
	@rm -rf build/*
