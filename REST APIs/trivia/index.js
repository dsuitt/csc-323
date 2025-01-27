const trivia = [
  { id: 1, question: "What does GCP stand for?", category: "Cloud Fundamentals", answer: "Google Cloud Platform" },
  { id: 2, question: "What is the primary billing unit for cloud resources in GCP?", category: "Cloud Fundamentals", answer: "Projects" },
  { id: 3, question: "Which GCP service is used for running serverless functions triggered by events?", category: "Compute Services", answer: "Cloud Functions" },
  { id: 4, question: "What is the command to list all GCP projects in the CLI?", category: "CLI Commands", answer: "gcloud projects list" },
  { id: 5, question: "In RESTful APIs, what HTTP method is typically used to retrieve data?", category: "REST APIs", answer: "GET" },
  { id: 6, question: "What is the maximum execution time for a Cloud Function in GCP?", category: "Compute Services", answer: "9 minutes" },
  { id: 7, question: "Which GCP service is ideal for running containerized workloads serverlessly?", category: "Compute Services", answer: "Cloud Run" },
  { id: 8, question: "What does IAM stand for in GCP?", category: "Cloud Fundamentals", answer: "Identity and Access Management" },
  { id: 9, question: "What is the name of the GCP service that lets you track API usage and quotas?", category: "Cloud Fundamentals", answer: "APIs & Services" },
  { id: 10, question: "What HTTP status code indicates a successful request?", category: "REST APIs", answer: "200" },
  { id: 11, question: "Which CLI command enables the Cloud Storage API for a project?", category: "CLI Commands", answer: "gcloud services enable storage.googleapis.com" },
  { id: 12, question: "What is the term for key-value pairs appended to a URL starting with a '?'?", category: "REST APIs", answer: "Query Strings" },
  { id: 13, question: "What is the key difference between Cloud Run and Cloud Functions?", category: "Compute Services", answer: "Cloud Run supports containerized applications, while Cloud Functions only supports pre-defined runtimes." },
  { id: 14, question: "Which HTTP method is typically used to create new resources in a RESTful API?", category: "REST APIs", answer: "POST" },
  { id: 15, question: "What command would you use to deploy a Cloud Function in GCP?", category: "CLI Commands", answer: "gcloud functions deploy" },
  { id: 16, question: "What is the first step when starting a project in GCP?", category: "Cloud Fundamentals", answer: "Create a GCP Project" },
  { id: 17, question: "Which GCP tool allows you to run commands directly from your browser?", category: "Cloud Fundamentals", answer: "Cloud Shell" },
  { id: 18, question: "What is the primary role of IAM in GCP?", category: "Cloud Fundamentals", answer: "Access control" },
  { id: 19, question: "Which GCP feature is used to enable a service like Cloud Storage for a project?", category: "APIs and Services", answer: "API Library" },
  { id: 20, question: "What is the CLI command to set the active project in GCP?", category: "CLI Commands", answer: "gcloud config set project <PROJECT_ID>" }
];

const correctResponses = [
  "Great job!",
  "You're absolutely right!",
  "That's spot on!",
  "Correct! Keep it up!",
  "You nailed it!"
];

exports.triviaApi = (req, res) => {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  console.log(method, url, path)

  if (method === "GET") {
    handleGetRequest(req, res);
  } else if (method === "POST" && (path === "/" || path === "/answer")) {
    handlePostRequest(req, res);
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

// Handle GET requests to retrieve a question
function handleGetRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const idFromParams = url.pathname.split('/').pop(); // Extract ID from URL if present
  const idFromQuery = url.searchParams.get('id'); // Extract ID from query string
  const idFromBody = req.body?.id; // Extract ID from request body
  const id = parseInt(idFromParams || idFromQuery || idFromBody);

  console.log(url, idFromParams, idFromQuery, idFromBody, id)

  if (!id) {
    res.status(400).send("Please provide a question ID via query, URL, or body.");
    return;
  }

  const question = trivia.find((q) => q.id === id);

  if (!question) {
    res.status(404).send("Question not found.");
    return;
  }

  // Send the question without the answer
  res.status(200).json({ id: question.id, question: question.question, category: question.category });
}

// Handle POST requests to check the answer
function handlePostRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const idFromParams = url.pathname.split('/').pop(); // Extract ID from URL if present
  const idFromBody = req.body?.id; // Extract ID from request body
  const userAnswer = req.body?.answer; // Extract user's answer from request body
  const id = parseInt(idFromParams || idFromBody);

  if (!id || !userAnswer) {
    res.status(400).send("Please provide a question ID and answer in the request body.");
    return;
  }

  const question = trivia.find((q) => q.id === id);

  if (!question) {
    res.status(404).send("Question not found.");
    return;
  }

  if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
    const response = correctResponses[Math.floor(Math.random() * correctResponses.length)];
    res.status(200).send(`${response} The correct answer is indeed: ${question.answer}`);
  } else {
    res.status(200).send(`Sorry, that's incorrect. The correct answer is: ${question.answer}`);
  }
}