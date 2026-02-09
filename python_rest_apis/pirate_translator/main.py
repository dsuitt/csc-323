import functions_framework
from google.cloud import storage
import re

# Initialize Storage Client outside the handler (Best Practice for cold starts)
storage_client = storage.Client()

def pirate_translate(text):
    """Simple dictionary-based pirate translator."""
    pirate_dict = {
        r"\bhello\b": "ahoy",
        r"\bhi\b": "yo-ho-ho",
        r"\bfriend\b": "me heartie",
        r"\bmoney\b": "doubloons",
        r"\bmy\b": "me",
        r"\bthe\b": "th'",
        r"\bis\b": "be",
        r"\bstop\b": "avast",
        r"\bwhere\b": "whar",
        r"\bmanager\b": "captain",
    }
    
    # Case insensitive replacement
    for word, pirate_word in pirate_dict.items():
        text = re.sub(word, pirate_word, text, flags=re.IGNORECASE)
    
    return text + "\n\n(Translated by The Pirate Hook 🏴‍☠️)"

# Triggered by a Change to a Cloud Storage Object
@functions_framework.cloud_event
def transform_file(cloud_event):
    data = cloud_event.data

    # 1. Get Event Data
    bucket_name = data["bucket"]
    file_name = data["name"]
    
    print(f"Processing file: {file_name} from bucket: {bucket_name}")

    # Safety Check: Prevent infinite loops! 
    if "processed-" in bucket_name:
        print("Skipping processed file to prevent loop.")
        return

    # 2. Setup Buckets
    source_bucket = storage_client.bucket(bucket_name)
    destination_bucket_name = f"{bucket_name}-processed"
    destination_bucket = storage_client.bucket(destination_bucket_name)

    # 3. Download the text
    blob = source_bucket.blob(file_name)
    text_content = blob.download_as_text()

    # 4. Transform
    pirate_text = pirate_translate(text_content)

    # 5. Upload to the Output Bucket
    new_blob = destination_bucket.blob(f"pirate_{file_name}")
    new_blob.upload_from_string(pirate_text)

    print(f"File translated and saved to {destination_bucket_name}/pirate_{file_name}")