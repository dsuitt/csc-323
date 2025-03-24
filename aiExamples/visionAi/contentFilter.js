const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

const bucketName = '';
const fileName = '';

const [result] = await client.safeSearchDetection(
  `gs://${bucketName}/${fileName}`
);
const detections = result.safeSearchAnnotation;
console.log(`Adult: ${detections.adult}`);
console.log(`Spoof: ${detections.spoof}`);
console.log(`Medical: ${detections.medical}`);
console.log(`Violence: ${detections.violence}`);