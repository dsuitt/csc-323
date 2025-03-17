const functions = require('@google-cloud/functions-framework');

functions.cloudEvent('helloGCS', cloudEvent => {
  console.log('Event received: ', cloudEvent)
  console.log(`Event ID: ${cloudEvent.id}`);
  console.log(`Event Type: ${cloudEvent.type}`);

  const file = cloudEvent.data;
  console.log('Cloud Event data: ', file);
  console.log(`Bucket: ${file.bucket}`);
  console.log(`File: ${file.name}`);
  console.log(`Metageneration: ${file.metageneration}`);
  console.log(`Created: ${file.timeCreated}`);
  console.log(`Updated: ${file.updated}`);
});