# fetch images from post
from dotenv import load_dotenv
from azure.data.tables import TableServiceClient
from azure.storage.blob import BlobServiceClient
from datetime import datetime, timezone
import random
import base64
import logging
import io
import os


load_dotenv()

def generate_post_id(user_id : str):
    """
    Generate a unique post ID based on user ID and current timestamp.
    Format: userID_YYYYMMDD_HHMMSS_randomNumber
    """
    timestamp = datetime.now().strftime("%Y%m%H%M%S")
    random_number = random.randint(1000, 9999)
    return f"post_{user_id}_{timestamp}_{random_number}"

def generate_image_id(user_id : str):
    """
    Generate a unique image ID based on user ID and current timestamp.
    Format: userID_YYYYMMDD_HHMMSS_randomNumber.jpg
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    random_number = random.randint(1000, 9999)
    return f"img_{user_id}_{timestamp}_{random_number}"

def fetch_images(post_id: str):
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
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
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    images = {}

    for name in blob_names:
        try:
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=name)
            blob_data = blob_client.download_blob().readall()
            base64_str = blob_data.decode("utf-8")
            decoded_bytes = base64.b64decode(base64_str)

            image_stream = io.BytesIO(decoded_bytes)
            image_stream.seek(0)

            images[name] = image_stream

            # read the blob data which was stored like this base64.b64encode(image_file.read()).decode("utf-8")



        except Exception as e:
            logging.error(f"Failed to fetch '{name}': {e}")
            images[name] = None  # or raise depending on your needs

    return images

def upload_image_to_blob(image_data, image_id, container_name="images"):
    """
    Upload an image to Azure Blob Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=image_id)

    try:
        # If it's a BytesIO object, reset the cursor and get raw bytes
        if isinstance(image_data, io.BytesIO):
            image_data.seek(0)
            image_data = image_data.read()

        blob_client.upload_blob(image_data, overwrite=True)
        logging.info(f"Image '{image_id}' uploaded successfully.")
        return True
    except Exception as e:
        logging.error(f"Failed to upload '{image_id}': {e}")
        return False


def upload_post_to_table(post_id, image_dict):
    """
    Upload post metadata to Azure Table Storage.
    """

    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    timestamp = datetime.now(timezone.utc).isoformat()
    for role , image_name in image_dict.items():
        entity = {
            "PartitionKey": post_id,
            "RowKey": role,
            "image_id": image_name,
            "uploaded_at": timestamp
        }
        table_client.upsert_entity(entity)