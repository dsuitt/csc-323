const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

const storage = new Storage();
const bucketName = ''; 


async function uploadFile(localFilePath) {
    const fileName = path.basename(localFilePath);
    await storage.bucket(bucketName).upload(localFilePath, {
        destination: fileName,
    });
    console.log(`Uploaded: ${localFilePath} → gs://${bucketName}/${fileName}`);
}


async function downloadFile(cloudFileName, destinationPath) {
    await storage.bucket(bucketName).file(cloudFileName).download({ destination: destinationPath });
    console.log(`Downloaded: gs://${bucketName}/${cloudFileName} → ${destinationPath}`);
}


async function uploadFileWithMetadata(localFilePath, metadata) {
    const fileName = path.basename(localFilePath);
    await storage.bucket(bucketName).upload(localFilePath, {
        destination: fileName,
        metadata: { metadata },
    });
    console.log(`Uploaded with metadata: ${localFilePath} → gs://${bucketName}/${fileName}`);
}


async function listAllFiles() {
    const [files] = await storage.bucket(bucketName).getFiles();
    console.log(`All files in gs://${bucketName}:`);
    files.forEach(file => console.log(file.name));
}


async function listFilesWithPrefix(prefix) {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix });
    console.log(`Files in gs://${bucketName}/${prefix}:`);
    files.forEach(file => console.log(file.name));
}




async function runExamples() {
    await uploadFile('project_ardent/2025/january/sales_report.csv');
    await uploadFile('project_ardent/2025/january/analytics_data.csv');
    await uploadFile('project_ardent/documents/guides/getting_started.txt');

    const metadata = {
        category: 'legal',
        lastUpdated: new Date().toISOString(),
    };

    await uploadFileWithMetadata('project_ardent/documents/legal/terms_of_service.txt', metadata);

    await listAllFiles();

    await listFilesWithPrefix('project_ardent/2025/january/');

    await downloadFile('sales_report.csv', 'downloaded_sales_report.csv');


}

// Run the example functions
runExamples().catch(console.error);