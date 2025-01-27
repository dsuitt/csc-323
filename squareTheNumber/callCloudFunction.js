const axios = require('axios');
const { execSync } = require('child_process');

async function callSquareMyNumber() {
  try {
    // Fetch the identity token using gcloud CLI
    const token = execSync('gcloud auth print-identity-token', { encoding: 'utf8' }).trim();

    // Prepare the request data
    const url = 'https://us-west2-my-new-test-project-447723.cloudfunctions.net/square-my-number';
    const data = { number: 9 };
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Make the POST request
    const response = await axios.post(url, data, { headers });
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
callSquareMyNumber()