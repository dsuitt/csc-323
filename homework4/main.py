from google.cloud import bigquery

def load_dataframe_to_bigquery(df, project_id, dataset_id, table_id):
    """
    Loads a Pandas DataFrame into a BigQuery table.

    Args:
        df (pd.DataFrame): The DataFrame containing the data.
        project_id (str): Google Cloud project ID.
        dataset_id (str): BigQuery dataset ID.
        table_id (str): BigQuery table ID.
    """
    client = bigquery.Client(project=project_id)
    table_ref = f"{project_id}.{dataset_id}.{table_id}"

    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND,  # Append to existing table
        autodetect=True,  # Auto-detect schema
        source_format=bigquery.SourceFormat.CSV,
    )

    job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
    job.result()  # Wait for the job to complete

    print(f"Loaded {job.output_rows} rows into {table_ref}.")

# Example usage:
# Assuming `df` is your pandas DataFrame containing the file data
import pandas as pd

df = pd.read_csv(r"C:\Users\Doug\Documents\Classes\CSC 323\csc-323\bigqueryExamples\homework4\sensor_data_20250220_033041.csv")  # Example: Replace with actual DataFrame source
load_dataframe_to_bigquery(df, "my-new-test-project-447723", "student_lab_dataset", "sensors")