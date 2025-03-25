const { VertexAI } = require('@google-cloud/vertexai');
const functions = require('@google-cloud/functions-framework');

const project = 'my-new-test-project-447723'
const location = 'us-west1'
const model = process.env.MODEL || 'gemini-1.5-flash';
const systemInstruction = 'You are a teachers assistant who is helping students answer questions about google cloud services.';

async function main() {

    const generativeModel = createModel();

    const userPrompt = 'What is the difference between Vertex AI and AutoML?';

    const response = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    });

    const textResponse = response.response.candidates[0].content.parts[0].text

    console.log(textResponse);
}

async function chat() {
    const chatModel = createChatModel();

    const userPrompt = 'My name is Doug. Can you tell me what the difference is between Vertex AI and AutoML?';

    const response = await chatModel.sendMessage(userPrompt);

    const textResponse = response.response.candidates[0].content.parts[0].text

    console.log(textResponse);

    const userPrompt2 = 'What is my name?';

    const response2 = await chatModel.sendMessage(userPrompt2);

    const textResponse2 = response2.response.candidates[0].content.parts[0].text

    console.log(textResponse2);

}



function createModel() {
    const vertexAI = new VertexAI({ project: project, location: location });

    const config = {
        temperature: 0.75,
    }
    const generativeModel = vertexAI.getGenerativeModel({
        model,
        systemInstruction: {
            role: 'system',
            parts: [{ "text": systemInstruction }]
        },
        generationConfig: config
    });
    return generativeModel;
}

function createChatModel() {
    const vertexAI = new VertexAI({ project: project, location: location });

    const generativeModel = vertexAI.getGenerativeModel({ model });

    const config = {
        temperature: 0.75,
    }
    const chatSession = generativeModel.startChat({
        systemInstruction: {
            role: 'system',
            parts: [{ "text": systemInstruction }]
        },
        generationConfig: config
    });

    return chatSession;
}

main().catch(console.error);