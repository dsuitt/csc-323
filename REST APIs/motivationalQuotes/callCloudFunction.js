const axios = require('axios'); //This is a Node.js module that allows you to make HTTP requests simple.
const { execSync } = require('child_process'); //This is a Node.js module that allows you to execute shell commands. It is used to run the gcloud command to get the identity token.

async function callHttpEndpoint() {
  try {
    // Fetch the identity token for the account you are currently signed into on your machine if you need to provide authentication to your endpoint
    const token = execSync(`gcloud auth print-identity-token`, { encoding: 'utf8' }).trim();

    // Prepare the request data
    const url = 'https://us-west2-my-new-test-project-447723.cloudfunctions.net/motivationalApi/quote/3';
    
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make the GET request. Notice that the method after axios defines the type of request you are making. In this case, it is a GET request. The first argument is the URL of the endpoint, the second argument is the headers you are sending to the endpoint.
    const response = await axios.get(url, { headers });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error calling the endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Call the function
callHttpEndpoint()