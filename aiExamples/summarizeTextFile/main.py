import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import storage

vertexai.init(project="<YOUR_PROJECT_ID>", location="us-central1")

model = GenerativeModel(
    model_name="gemini-1.5-pro-001",
    system_instruction=[
        "Summarize the following document in a single sentence. Do not respond with more than one sentence.",
    ],
)

# Triggered by a change in a storage bucket
@functions_framework.cloud_event
def hello_gcs(cloud_event):
    data = cloud_event.data

    # download the file
    storage_client = storage.Client()
    blob = storage_client.bucket(data["bucket"]).get_blob(data["name"])
    #print(blob)

    doc = blob.download_as_text()
    contents = [doc]

    response = model.generate_content(contents)
    print(response.text)

    print(f"Response from Model: {response.text}")