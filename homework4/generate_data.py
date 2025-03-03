import csv
import random
import datetime

# Configuration
CSV_FILE_NAME = f"sensor_data_{datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"

def generate_sensor_data(num_rows=100):
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

# Write to CSV file
def write_csv(file_name, data):
    headers = ["timestamp", "sensor_id", "location", "temperature", "humidity", "co2", "power_usage"]
    
    if any(len(row) > len(headers) for row in data):
        headers.append("extra_column")

    with open(file_name, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(data)

# Run the script
if __name__ == "__main__":
    sensor_data = generate_sensor_data(100) 
    write_csv(CSV_FILE_NAME, sensor_data)