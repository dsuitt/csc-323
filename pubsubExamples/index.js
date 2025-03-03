const { PubSub } = require('@google-cloud/pubsub');

async function publishMessage(topicName, data) {
    const pubSubClient = new PubSub();

    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Error publishing message: ${error.message}`);
    }
}


const topicName = 'projects/my-new-test-project-447723/topics/test_topic';
const data = {
    key1: 'value1',
    key2: 'value2'
};

publishMessage(topicName, data);