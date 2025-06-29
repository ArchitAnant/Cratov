# fetch images from post
from dotenv import load_dotenv
from azure.data.tables import TableServiceClient
from azure.storage.blob import BlobServiceClient
import logging
import io
import os


load_dotenv()
def fetch_images(post_id: str):
    connection_string = os.getenv("BLOB_STORAGE_CONNECTION_STRING")
    table_client = TableServiceClient.from_connection_string(connection_string).get_table_client("posts")
    entities = table_client.query_entities(f"PartitionKey eq '{post_id}'")

    images = []

    for entity in entities:       # e.g., 'front', 'left', etc.
        image_id = entity["image_id"]   # blob filename
        images.append(image_id)

    return images




def get_image_from_blob(blob_names, container_name="images"):
    """
    Fetch an image from Azure Blob Storage and return as BytesIO for model input.
    """
    connection_string = os.getenv("BLOB_STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    images = {}

    for name in blob_names:
        try:
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=name)
            blob_data = blob_client.download_blob().readall()
            images[name] = io.BytesIO(blob_data)
        except Exception as e:
            logging.error(f"Failed to fetch '{name}': {e}")
            images[name] = None  # or skip / raise, depending on how strict you want to be

    return images