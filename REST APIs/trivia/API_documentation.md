# Trivia API Documentation

## Overview
The Trivia API allows users to interact with a trivia game, retrieving questions and submitting answers. It supports two primary endpoints:

- **GET**: Retrieve a trivia question based on its ID.
- **POST**: Submit an answer to a trivia question.

## Base URL
```
https://us-west2-my-new-test-project-447723.cloudfunctions.net/triviaRestAPi
```

## Endpoints

### 1. Retrieve a Question
Retrieve a trivia question (without the answer) using a GET request.

- **HTTP Method**: GET
- **URL**: /triviaRestAPi
- **Query Parameters**:
  - `id` (optional): The ID of the question to retrieve.
- **Path Parameters**:
  - You can include the ID directly in the URL path, e.g., `/triviaRestAPi/<id>`.
- **Body** (optional):
```json
{
  "id": 1
}
```

#### Example Request
Using Query Parameters:
```
GET /triviaRestAPi?id=1
```
Using URL Path:
```
GET /triviaRestAPi/1
```
Using Request Body:
```json
{
  "id": 1
}
```

#### Example Response
Success (200):
```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "category": "Geography"
}
```
Error (400): Missing ID.
```json
{
  "error": "Please provide a question ID via query, URL, or body."
}
```
Error (404): Question not found.
```json
{
  "error": "Question not found."
}
```

### 2. Answer a Question
Submit an answer to a trivia question using a POST request.

- **HTTP Method**: POST
- **URL**:
  - Base path: `/triviaRestAPi`
  - Alternative path: `/triviaRestAPi/answer`
- **Body**:
```json
{
  "id": 1,
  "answer": "Paris"
}
```

#### Example Request
```json
POST /triviaApi/answer
{
  "id": 1,
  "answer": "Paris"
}
```

#### Example Response
Correct Answer (200):
```
Great job! The correct answer is indeed: Paris
```
Incorrect Answer (200):
```
Sorry, that's incorrect. The correct answer is: Paris
```
Error (400): Missing ID or answer.
```json
{
  "error": "Please provide a question ID and answer in the request body."
}
```
Error (404): Question not found.
```json
{
  "error": "Question not found."
}
```

## Examples

### GET Request
Retrieve the question with ID 3:
```
curl "https://<your-cloud-function-url>/triviaRestAPi?id=3"
```
Response:
```json
{
  "id": 3,
  "question": "What is 2 + 2?",
  "category": "Math"
}
```

### POST Request
Submit an answer for question ID 3:
```
curl -X POST "https://<your-cloud-function-url>/triviaRestAPi/answer" \
-H "Content-Type: application/json" \
-d '{
  "id": 3,
  "answer": "4"
}'
```
Response (Correct):
```
Great job! The correct answer is indeed: 4
```
Response (Incorrect):
```
Sorry, that's incorrect. The correct answer is: 4
```

## Error Codes
- 400: Missing or invalid parameters in the request.
- 404: Question not found.
- 405: Method not allowed.

## Notes
- IDs must be integers and correspond to the trivia question database.
- Case-insensitive comparison is used for answers.