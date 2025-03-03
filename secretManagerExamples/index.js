const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

const projectId = '';

async function createSecret(secretId, secretValue) {

    const [secret] = await client.createSecret({
        parent: `projects/${projectId}`,
        secretId: secretId,
        secret: {
            replication: {
                automatic: {},
            },
        },
    });

    const [version] = await client.addSecretVersion({
        parent: secret.name,
        payload: {
            data: Buffer.from(secretValue, 'utf8'),
        },
    });

    console.log(`Created secret ${secret.name} with version ${version.name}`);
}

async function updateSecret(secretId, secretValue) {
    const [secret] = await client.getSecret({
        name: `projects/${projectId}/secrets/${secretId}`,
    });

    const [version] = await client.addSecretVersion({
        parent: secret.name,
        payload: {
            data: Buffer.from(secretValue, 'utf8'),
        },
    });

    console.log(`Updated secret ${secret.name} with new version ${version.name}`);
}

async function accessSecret(secretId) {
    const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretId}/versions/latest`,
    });

    const payload = version.payload.data.toString('utf8');
    console.log(`Accessed secret ${secretId}: ${payload}`);
}

// Example usage
(async () => {
    await createSecret('my-secret', 'my-secret-value-test');
    await updateSecret('my-secret', 'my-updated-secret-value-test');
    await accessSecret('my-secret');
})();
