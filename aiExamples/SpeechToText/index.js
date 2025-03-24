const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();


const project = 'my-new-test-project-447723'
const location = 'us-west1'
const targetBucket = 'csc323-stt-transcripts'
const sourceBucket = 'csc323-audio-files'
const googleSTTModel = 'chirp'

async function main(filePath, user) {

    const bucket = storage.bucket(sourceBucket);
    const file = bucket.file(filePath);

    const [metadata] = await file.getMetadata();
    const fileSize = metadata.size;
    const fileName = metadata.name;

    if (fileSize < 60000000) {
        await transcribeSynchronouslyV2(sourceBucket, user, filePath, fileName);
    }
    else {
        await submitAsyncTranscriptionJobV2(sourceBucket, user, filePath, fileName);
    }

    return;
}



async function submitAsyncTranscriptionJobV2(sourceBucket, filePath) {
    const speechV2 = require('@google-cloud/speech').v2;
    const client = new speechV2.SpeechClient({ servicePath: 'us-central1-speech.googleapis.com' });
    const gcsUri = `gs://${sourceBucket}/${filePath}`;
    const output = `gs://${targetBucket}`;


    const config = {
        autoDecodingConfig: {},  // Automatically detect encoding when not specified
        languageCodes: ['en-US'],
        features: {
            enableAutomaticPunctuation: true,
            enableWordTimeOffsets: false,
            enableWordConfidence: false,
        },
        model: googleSTTModel
    };

    const request = {
        recognizer: `projects/${project}/locations/${location}/recognizers/${googleSTTRecognizer}`, // Create a recognizer config in the console first
        config: config,
        files: [
            {
                uri: gcsUri,  // this is the location of the audio file in GCS
            }
        ],
        recognitionOutputConfig: {
            gcsOutputConfig: {
                uri: output // this is the location where the transcript will be stored in GCS
            }
        },
        processingStrategy: 'PROCESSING_STRATEGY_UNSPECIFIED'
    };

    // Submit the long-running transcription job (v2 API)
    const [operation] = await client.batchRecognize(request);
    const operationName = operation.name;
}


async function transcribeSynchronouslyV2(bucket, filePath) {

    const speechV2 = require('@google-cloud/speech').v2;
    const client = new speechV2.SpeechClient({ servicePath: 'us-central1-speech.googleapis.com' });
    const uri = `gs://${bucket}/${filePath}`

    const config = {
        autoDecodingConfig: {},  // Automatically detect encoding
        languageCodes: ['en-US'],
        features: {
            enableAutomaticPunctuation: true,
            enableWordTimeOffsets: false,
            enableWordConfidence: false,
        },
        model: googleSTTModel
    };

    const request = {
        recognizer: `projects/${project}/locations/${location}/recognizers/${googleSTTRecognizer}`, // Create a recognizer config in the console first
        config: config,
        uri
    };
    const [response] = await client.recognize(request);

    const transcript = JSON.stringify(response, null, 2);

    console.log('Transcript: ', transcript);

}