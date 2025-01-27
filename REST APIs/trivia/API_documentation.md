# Trivia Quiz API Documentation

Welcome to the Trivia Quiz API! This API allows you to retrieve trivia questions, filter them by category, and answer them to test your knowledge.

---

## Base URL
https://your-cloud-run-url/

---

## Endpoints

### 1. Get a Trivia Question
Retrieve a random trivia question or filter by category.

- **URL:** `/trivia`
- **Methods:** `GET`, `POST`
- **Purpose:** Returns trivia questions.

#### Using `GET` Method:
- **Query Parameters:**  
  - `category` (optional): Filter trivia questions by category (case-insensitive).

**Example Request (GET):**
```http
GET /trivia?category=Computer%20Science
```

**Example Response:**
```json
[
  {
    "id": 5,
    "question": "What is the only programming language named after coffee?",
    "category": "Computer Science"
  }
]
```

#### Using `POST` Method:
- **Body (JSON):**
  - `category` (optional): Filter trivia questions by category (case-insensitive).

**Example Request (POST):**
```http
POST /trivia
Content-Type: application/json

{
  "category": "Computer Science"
}
```

**Example Response:**
```json
[
  {
    "id": 9,
    "question": "What does CSS stand for?",
    "category": "Computer Science"
  }
]
```

Note: Answers are not included when retrieving questions. Use the `/trivia/answer` endpoint to submit and verify your answer.

### 2. Answer a Trivia Question
Submit an answer to a specific trivia question and check if it’s correct.

- **URL:** `/trivia/answer`
- **Method:** `POST`
- **Purpose:** Evaluates the submitted answer.
- **Body (JSON):**
  - `id`: The ID of the question being answered.
  - `answer`: The user’s answer (case-insensitive).

**Example Request:**
```http
POST /trivia/answer
Content-Type: application/json

{ "id": 5, "answer": "Java" }
```

**Response for Correct Answer:**
```json
{
  "message": "Correct!",
  "correctAnswer": "Java"
}
```

**Response for Wrong Answer:**
```json
{
  "message": "Wrong!",
  "correctAnswer": "Java"
}
```

### Available Categories
The following categories are supported (case-insensitive):

- Geography
- Art
- Math
- Computer Science
- Science

### Error Responses

#### 404 Not Found:
Example: If the category or question ID is invalid.
**Response:**
```json
{ "message": "Question not found" }
```

#### 400 Bad Request:
Example: Missing required fields in the body.
**Response:**
```json
{ "message": "Invalid request format" }
```