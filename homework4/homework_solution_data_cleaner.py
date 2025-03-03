import os
import pandas as pd
from google.cloud import storage, bigquery
import functions_framework

# Define expected column names and value ranges
EXPECTED_COLUMNS = ["timestamp", "sensor_id", "location", "temperature", "humidity", "co2", "power_usage"]
VALID_RANGES = {
    "temperature": (18, 30),
    "humidity": (0, 100),
    "co2": (300, 600),
    "power_usage": (0.5, 5.0),
}

@functions_framework.cloud_event
def clean_and_load_data(cloud_event):
    """Triggered by a change to a Cloud Storage bucket.
       Cleans and loads IoT sensor data into BigQuery."""
    
    # Get bucket and file name from event
    data = cloud_event.data
    bucket_name = data["bucket"]
    file_name = data["name"]

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)

    # Download file content
    temp_file = f"/tmp/{os.path.basename(file_name)}"
    blob.download_to_filename(temp_file)

    # Load CSV into DataFrame
    try:
        df = pd.read_csv(temp_file)
    except Exception as e:
        print(f"Error reading CSV from cloud storage: {e}")
        return

    # Validate schema
    if list(df.columns) != EXPECTED_COLUMNS:
        print(f"Schema mismatch in file: {file_name}")
        return

    # Data Cleaning
    for col, (min_val, max_val) in VALID_RANGES.items():
        df[col] = pd.to_numeric(df[col], errors='coerce')  # Convert to numeric types
        df[col].fillna(min_val, inplace=True)  # Replace missing with min value
        df[col] = df[col].clip(min_val, max_val)  # Clip out-of-range values

   
    df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors='coerce')  # Convert Timestamp to correct format
    df.dropna(subset=["Timestamp"], inplace=True)  # Drop rows with invalid timestamps

    # Load cleaned data into BigQuery
    bq_client = bigquery.Client()
    dataset_id = "student_lab_dataset"
    table_id = "test_table"
    table_ref = bq_client.dataset(dataset_id).table(table_id)

    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
        source_format=bigquery.SourceFormat.CSV,
        autodetect=True,
        skip_leading_rows=1,
    )

    # Upload CSV file to BigQuery from local file
    with open(temp_file, "rb") as source_file:
        job = bq_client.load_table_from_file(source_file, table_ref, job_config=job_config)
    
    job.result() #wait for job to finish

    # Alternative: Upload DataFrame directly to BigQuery using bq_client
    job = bq_client.load_table_from_dataframe(df, table_ref, job_config=bigquery.LoadJobConfig(write_disposition="WRITE_APPEND"))
    job.result()  

    print(f"File {file_name} processed and loaded into BigQuery successfully.")
    
    # Cleanup temp file
    os.remove(temp_file)