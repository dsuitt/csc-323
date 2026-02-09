import functions_framework

@functions_framework.http
def square_number(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    data = request.get_json(silent=True)
    number = data.get('number')
    if not data or 'number' not in data:
            return 'Invalid JSON or missing "number" field', 400
            
    try:
        squared = float(data['number']) ** 2
        return f'Your number squared is {squared}'
    except (TypeError, ValueError):
        return 'Value provided is not a number', 400