
// #3
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
function convertToJpg(req, next) {
  // convert eps images to png
  console.time('convertToJpg');
  const { data } = req;
  const { gm } = req.deps;
  const response = data.s3Object;
  console.log(`Reponse content type: ${response.ContentType}`);
  console.log('Conversion');
  gm(response.Body)
    .antialias(true)
    .density(300)
    .toBuffer('JPG', (err, buffer) => {
      if (err) {
        console.error('convertToJpg error in toBuffer:', err);
      }
      data.buffer = buffer;
      console.timeEnd('convertToJpg');
      next(err, req);
    });
}


module.exports = {
  convertToJpg,
};

