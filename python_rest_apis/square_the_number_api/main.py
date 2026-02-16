import functions_framework

def cube_my_number(number):
    """Helper function to cube a number."""
    return number ** 3

def square_my_number(number):
    """Helper function to square a number."""
    return number ** 2

@functions_framework.http
def request_handler(request):
    data = request.get_json(silent=True)
    number = data.get('number')

    if not data or 'number' not in data:
        return 'Invalid JSON or missing "number" field', 400

    try:
        squared = square_my_number(float(number))
        cubed = cube_my_number(float(number))
        return f'Your number squared is {squared} and cubed is {cubed}'
    except (TypeError, ValueError):
        return 'Value provided is not a number', 400
