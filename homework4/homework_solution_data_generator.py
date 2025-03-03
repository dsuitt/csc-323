import csv
import random
import datetime
import os
import functions_framework
from google.cloud import storage

# Configuration
BUCKET_NAME = "csc_323_bucket" 
NUM_ROWS = 100  # Number of sensor data rows to generate

def generate_sensor_data(num_rows=NUM_ROWS):
    """Generates synthetic IoT sensor data."""
    locations = ["Room A", "Room B", "Room C", "Room D"]
    sensor_ids = range(90, 110)  

    data = []
    for _ in range(num_rows):
        timestamp = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=random.randint(1, 1440))

        sensor_id = random.choice(sensor_ids) if random.random() > 0.05 else None
        location = random.choice(locations) if random.random() > 0.05 else None
        temperature = round(random.uniform(18.0, 30.0), 2)
        humidity = round(random.uniform(30, 80), 2) if random.random() > 0.05 else ""
        co2 = random.randint(300, 600)
        power_usage = round(random.uniform(0.5, 5.0), 2)

        data.append([timestamp, sensor_id, location, temperature, humidity, co2, power_usage])

    return data

def write_csv(file_path, data):
    """Writes sensor data to a CSV file."""
    headers = ["timestamp", "sensor_id", "location", "temperature", "humidity", "co2", "power_usage"]

    with open(file_path, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(data)

@functions_framework.http
def generate_and_upload_data(request):
    """Cloud Function to generate sensor data and upload it to Cloud Storage."""
    # Generate a timestamped file name
    timestamp_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S")
    file_name = f"sensor_data_{timestamp_str}.csv"
    file_path = f"/tmp/{file_name}"

    # Generate and write sensor data
    sensor_data = generate_sensor_data(NUM_ROWS)
    write_csv(file_path, sensor_data)

    # Upload to Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)

    # Organize files into folders by day
    folder_name = datetime.datetime.now(datetime.timezone.utc).strftime("%Y/%m/%d")
    blob = bucket.blob(f"{folder_name}/{file_name}")
    blob.upload_from_filename(file_path)

    # Cleanup local temp file
    os.remove(file_path)

    return f"File {file_name} successfully uploaded to {BUCKET_NAME}/{folder_name}/", 200
