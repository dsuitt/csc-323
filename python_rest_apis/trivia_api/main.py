from flask import Flask, request, jsonify
import random
import functions_framework

app = Flask(__name__)

trivia = [
    {"id": 1, "question": "What does GCP stand for?", "category": "Cloud Fundamentals", "answer": "Google Cloud Platform"},
    {"id": 2, "question": "What is the primary billing unit for cloud resources in GCP?", "category": "Cloud Fundamentals", "answer": "Projects"},
    {"id": 3, "question": "Which GCP service is used for running serverless functions triggered by events?", "category": "Compute Services", "answer": "Cloud Functions"},
    {"id": 4, "question": "What is the command to list all GCP projects in the CLI?", "category": "CLI Commands", "answer": "gcloud projects list"},
    {"id": 5, "question": "In RESTful APIs, what HTTP method is typically used to retrieve data?", "category": "REST APIs", "answer": "GET"},
    {"id": 6, "question": "What is the maximum execution time for a Cloud Function in GCP?", "category": "Compute Services", "answer": "9 minutes"},
    {"id": 7, "question": "Which GCP service is ideal for running containerized workloads serverlessly?", "category": "Compute Services", "answer": "Cloud Run"},
    {"id": 8, "question": "What does IAM stand for in GCP?", "category": "Cloud Fundamentals", "answer": "Identity and Access Management"},
    {"id": 9, "question": "What is the name of the GCP service that lets you track API usage and quotas?", "category": "Cloud Fundamentals", "answer": "APIs & Services"},
    {"id": 10, "question": "What HTTP status code indicates a successful request?", "category": "REST APIs", "answer": "200"},
    {"id": 11, "question": "Which CLI command enables the Cloud Storage API for a project?", "category": "CLI Commands", "answer": "gcloud services enable storage.googleapis.com"},
    {"id": 12, "question": "What is the term for key-value pairs appended to a URL starting with a '?'?", "category": "REST APIs", "answer": "Query Strings"},
    {"id": 13, "question": "What is the key difference between Cloud Run and Cloud Functions?", "category": "Compute Services", "answer": "Cloud Run supports containerized applications, while Cloud Functions only supports pre-defined runtimes."},
    {"id": 14, "question": "Which HTTP method is typically used to create new resources in a RESTful API?", "category": "REST APIs", "answer": "POST"},
    {"id": 15, "question": "What command would you use to deploy a Cloud Function in GCP?", "category": "CLI Commands", "answer": "gcloud functions deploy"},
    {"id": 16, "question": "What is the first step when starting a project in GCP?", "category": "Cloud Fundamentals", "answer": "Create a GCP Project"},
    {"id": 17, "question": "Which GCP tool allows you to run commands directly from your browser?", "category": "Cloud Fundamentals", "answer": "Cloud Shell"},
    {"id": 18, "question": "What is the primary role of IAM in GCP?", "category": "Cloud Fundamentals", "answer": "Access control"},
    {"id": 19, "question": "Which GCP feature is used to enable a service like Cloud Storage for a project?", "category": "APIs and Services", "answer": "API Library"},
    {"id": 20, "question": "What is the CLI command to set the active project in GCP to test?", "category": "CLI Commands", "answer": "gcloud config set project test"},
]

correct_responses = [
    "Great job!",
    "You're absolutely right!",
    "That's spot on!",
    "Correct! Keep it up!",
    "You nailed it!"
]

# --- API Endpoints ---

@app.get("/trivia")
def get_trivia_by_query():
    # Query params: /trivia?id=1
    id_val = request.args.get('id')
    if not id_val:
        return "Please provide an ID (?id=x)", 400
    
    question = next((q for q in trivia if q["id"] == int(id_val)), None)
    return jsonify(question) if question else ("Not found", 404)

@app.get("/trivia/<int:trivia_id>")
def get_trivia_by_path(trivia_id):
    # Path params: /trivia/1
    question = next((q for q in trivia if q["id"] == trivia_id), None)
    return jsonify(question) if question else ("Not found", 404)

@app.post("/trivia/answer")
def check_answer():
    # JSON Body: /trivia/answer
    data = request.get_json()
    id_val = data.get('id')
    user_answer = data.get('answer')

    question = next((q for q in trivia if q["id"] == id_val), None)
    if not question:
        return "Question not found", 404

    if user_answer.strip().lower() == question["answer"].strip().lower():
        return f"{random.choice(correct_responses)} Answer: {question['answer']}"
    return f"Incorrect. The answer was: {question['answer']}"

# --- GCP Bridge ---
@functions_framework.http
def trivia_api(request):
    print(f"Received request: {request.method} {request.path}")
    print(f"DEBUG: Data payload: {request.get_data()}")
    #cloud functions requires an entrypoint function to send the request to.
    # this code converts the GCP request into a Flask request.
    with app.request_context(request.environ):
        return app.full_dispatch_request()
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)