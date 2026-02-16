import datetime
import google.auth
from google.auth.transport import requests
import functions_framework
from google.cloud import storage

@functions_framework.http
def generate_signed_url(request):
    # request_json = request.get_json(silent=True)
    # bucket_name = request_json.get('bucket_name')
    # blob_name = request_json.get('blob_name')

    bucket_name = "csc_323_bucket_test"
    blob_name = "Lab 1.docx"
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    # 1. Get credentials and the specific service account email
    credentials, project_id = google.auth.default()
    
    request = requests.Request()
    credentials.refresh(request)

    url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=15),
            method="GET",
            service_account_email=credentials.service_account_email, 
            access_token=credentials.token
        )

    return url