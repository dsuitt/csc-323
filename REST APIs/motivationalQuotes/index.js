const quotes = [
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
    "Success is not the key to happiness. Happiness is the key to success. — Albert Schweitzer",
    "If you think you are too small to make a difference, try sleeping with a mosquito. — Dalai Lama",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "If opportunity doesn't knock, build a door. — Milton Berle",
    "You miss 100% of the shots you don't take. — Wayne Gretzky",
    "The best way to predict the future is to invent it. — Alan Kay",
    "A day without laughter is a day wasted. — Charlie Chaplin",
    "To succeed in life, you need three things: a wishbone, a backbone, and a funny bone. — Reba McEntire",
  ];
  
  // Exported function for Cloud Run
  exports.quoteApi = (req, res) => {
    // Ensure method is GET
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
  
    // Extract the `id` from URL query parameters, body, or path
    const urlParts = req.url.split("/");
    const pathId = urlParts[2]; // Extract `id` from path, e.g., /quote/2
    const queryId = req.query.id;
    const bodyId = req.body && req.body.id;
  
    // Determine which ID to use (priority: path > query > body)
    const id = pathId || queryId || bodyId;
  
    // Validate the ID
    if (id === undefined || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing 'id' parameter" });
    }
  
    const index = parseInt(id, 10);
  
    // Ensure the ID is within range
    if (index < 0 || index >= quotes.length) {
      return res.status(404).json({ success: false, message: "Quote not found" });
    }
  
    // Return the requested quote
    return res.status(200).json({
      success: true,
      id: index,
      quote: quotes[index],
    });
  };