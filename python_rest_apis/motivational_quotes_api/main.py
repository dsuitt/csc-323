from flask import Flask, request, jsonify
import functions_framework

app = Flask(__name__)

quotes = [
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
]

@app.route('/quote/<id>', methods=['GET'])
def get_quote_by_path(id):
    return get_quote(id)

@app.route('/quote', methods=['GET'])
def get_quote_by_query():
    id = request.args.get('id')
    return get_quote(id)

def get_quote(id):
    if id is None or not id.isdigit():
        return jsonify({"success": False, "message": "Invalid or missing 'id' parameter"}), 400
    index = int(id)
    if index < 0 or index >= len(quotes):
        return jsonify({"success": False, "message": "Quote not found"}), 404
    return jsonify({"success": True, "id": index, "quote": quotes[index]}), 200

# --- GCP Bridge ---
@functions_framework.http
def motivational_quotes_api(request):
    print(f"Received request: {request.method} {request.path}")
    print(f"DEBUG: Data payload: {request.get_data()}")
    #cloud functions requires an entrypoint function to send the request to.
    # this code converts the GCP request into a Flask request.
    with app.request_context(request.environ):
        return app.full_dispatch_request()
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
