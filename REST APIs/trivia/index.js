const trivia = [
    { id: 1, question: "What is the capital of France?", category: "Geography", answer: "Paris" },
    { id: 2, question: "Who painted the Mona Lisa?", category: "Art", answer: "Leonardo da Vinci" },
    { id: 3, question: "What is 2 + 2?", category: "Math", answer: "4" },
    { id: 4, question: "What is the binary representation of 42?", category: "Computer Science", answer: "101010" },
    { id: 5, question: "What is the only programming language named after coffee?", category: "Computer Science", answer: "Java" },
    { id: 6, question: "Which planet is closest to the sun?", category: "Geography", answer: "Mercury" },
    { id: 7, question: "What’s 9 + 10? (Hint: Vine)", category: "Math", answer: "21" },
    { id: 8, question: "Which animal is known as the king of the jungle?", category: "Geography", answer: "Lion" },
    { id: 9, question: "What does CSS stand for?", category: "Computer Science", answer: "Cascading Style Sheets" },
    { id: 10, question: "What is the largest organ in the human body?", category: "Science", answer: "Skin" },
  ];
  
  exports.triviaApi = (req, res) => {
    const { method, url } = req;
  
    // Parse request URL and query string
    const urlParts = url.split("?");
    const endpoint = urlParts[0];
    const queryParams = new URLSearchParams(urlParts[1] || "");
  
    if (method === "GET" && endpoint === "/trivia") {
      const category = queryParams.get("category");
  
      // Filter questions by category if provided
      const filtered = category
        ? trivia.filter((q) => q.category.toLowerCase() === category.toLowerCase())
        : [trivia[Math.floor(Math.random() * trivia.length)]];
  
      return res.status(200).json(
        filtered.map(({ id, question, category }) => ({
          id,
          question,
          category,
        }))
      );
    }
  
    if (method === "POST" && endpoint === "/trivia") {
      try {
        const body = JSON.parse(req.body || "{}");
        const category = body.category;
  
        // Filter questions by category if provided
        const filtered = category
          ? trivia.filter((q) => q.category.toLowerCase() === category.toLowerCase())
          : [trivia[Math.floor(Math.random() * trivia.length)]];
  
        return res.status(200).json(
          filtered.map(({ id, question, category }) => ({
            id,
            question,
            category,
          }))
        );
      } catch (error) {
        return res.status(400).json({ message: "Invalid request format" });
      }
    }
  
    if (method === "POST" && endpoint === "/trivia/answer") {
      try {
        const body = JSON.parse(req.body || "{}");
        const { id, answer } = body;
  
        // Find the question by ID
        const question = trivia.find((q) => q.id === id);
  
        if (!question) {
          return res.status(404).json({ message: "Question not found" });
        }
  
        const isCorrect = question.answer.toLowerCase() === (answer || "").toLowerCase();
        return res.status(200).json({
          message: isCorrect ? "Correct!" : "Wrong!",
          correctAnswer: question.answer,
        });
      } catch (error) {
        return res.status(400).json({ message: "Invalid request format" });
      }
    }
  
    return res.status(404).json({ message: "Endpoint not found" });
  };