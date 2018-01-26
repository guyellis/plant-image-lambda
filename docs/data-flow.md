# How does plant-image-lambda work?

`plant-image-lambda` is an AWS Lambda Function that reduces images into smaller sizes for the Plant project.

Here is a summary of the data-flow that takes place.

- A user uploads an image on the Plaaant site - [Browser Image Upload](#browser-image-upload)
- The Plaaant server receives the image.
  - The image is written to a bucket on Amazon S3
  - An entry is written to the Plaaant database.
- The writing of the image to the S3 bucket triggers a call to the `plant-image-lambda` function.
- The `plant-image-lambda` function pulls the image and produces up to 5 smaller images from it and writes them to buckets on S3.
- The `plant-image-lambda` function calls the Plaaant server with details of the new images.
- The Plaaant server updates the database with the new images available.

## Browser Image Upload

TBD...
