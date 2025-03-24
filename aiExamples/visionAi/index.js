const vision = require('@google-cloud/vision');


async function labelImage(file) {

    const client = new vision.ImageAnnotatorClient();
    const visionRequest = {
        image: { source: { imageUri: `gs://${file.bucket}/${file.name}` } },
        features: [
            { type: 'LABEL_DETECTION' },
        ]
    };
    const visionPromise = client.annotateImage(visionRequest);

    const visionResponse = await visionPromise;
    console.log(`Raw vision output for: ${file.name}: ${JSON.stringify(visionResponse[0])}`);
    let status = "Failed"
    let labels = "";
    for (const label of visionResponse[0].labelAnnotations) {
        status = label.description == "Food" ? "Ready" : status
        labels = labels.concat(label.description, ", ");
    }
    console.log(`\nVision API labels: ${labels}\n`);

}

const file = {
    bucket: "csc_323_bucket",
    name: "food.jpg"
}

labelImage(file);