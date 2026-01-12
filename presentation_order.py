import random

presentation_order = [
    "Noah Lee",
    "Joel Burns",
    "Taylor Wall",
    "Elijah Salgado",
    "Abigail Dahlgren",
    "Elias Murcray",
    "Parker Williams",
    "James Furdui",
    "Michael E Newbold",
    "Matthew Craig",
    "Joshua Gomez",
    "Mckayla Guzman",
    "Paul Panlilio",
    "Rachel Montenegro"
]

def get_random_order():
    return random.sample(presentation_order, len(presentation_order))

random_order = get_random_order()
for name in random_order:
    print(name)