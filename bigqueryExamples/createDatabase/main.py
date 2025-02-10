import pandas as pd
import uuid
import random
from datetime import datetime, timedelta

# Define product catalog with fixed prices
product_catalog = {
    "Laptop": {"category": "Electronics", "price": 1200.00},
    "Smartphone": {"category": "Electronics", "price": 800.00},
    "Headphones": {"category": "Electronics", "price": 150.00},
    "Coffee Maker": {"category": "Home", "price": 80.00},
    "Blender": {"category": "Home", "price": 60.00},
    "Vacuum Cleaner": {"category": "Home", "price": 200.00},
    "T-Shirt": {"category": "Clothing", "price": 20.00},
    "Jeans": {"category": "Clothing", "price": 50.00},
    "Sneakers": {"category": "Clothing", "price": 100.00},
}

num_rows = 100000
data = []

start_date = datetime.now() - timedelta(days=365)  # Generate transactions from the past year

for _ in range(num_rows):
    transaction_id = str(uuid.uuid4())  # Unique transaction ID
    customer_id = random.randint(1000, 9999)  # Random customer ID
    product = random.choice(list(product_catalog.keys()))  # Select a product
    category = product_catalog[product]["category"]  # Get category
    price = product_catalog[product]["price"]  # Get fixed price
    quantity = random.randint(1, 10)  # Random quantity purchased
    transaction_date = start_date + timedelta(days=random.randint(0, 365))  # Random transaction date
    total_cost = round(quantity * price, 2)  # Compute total cost

    data.append([transaction_id, customer_id, product, category, quantity, price, transaction_date, total_cost])

# Convert to DataFrame and save to CSV
df = pd.DataFrame(data, columns=["transaction_id", "customer_id", "product_name", "category", "quantity", "price", "transaction_date", "total_cost"])
csv_file_path = "transactions.csv"
df.to_csv(csv_file_path, index=False)

print(f"CSV file with {num_rows} rows created: {csv_file_path}")