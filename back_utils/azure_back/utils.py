# fetch images from post
from dotenv import load_dotenv
from azure.data.tables import TableServiceClient
from azure.storage.blob import BlobServiceClient
from datetime import datetime, timezone
from collections import defaultdict
from report.dynamic_info import get_road_traffic_analysis, parse_weather_forcast
from report.static_info import get_street_name_and_address, get_soil_properties, get_population_density_from_tif
from report.openai_inference import OpenAIChat
import random
import base64
import logging
import io
import os
from dotenv import load_dotenv
from azure.core.exceptions import ResourceExistsError, HttpResponseError
import json




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
        if entity["RowKey"] in ["front", "left", "right", "back"]:
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

def upload_post_to_table(post_id,username, landmark, coordinates, image_dict):
    """
    Upload post metadata to Azure Table Storage.
    """

    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    timestamp = datetime.now(timezone.utc).isoformat()
    # upload landmark and coordinates
    entity = {
        "PartitionKey": post_id,
        "RowKey": "metadata",
        "username": username,
        "landmark": landmark,
        "coordinates": f"{coordinates['lat']},{coordinates['lon']}",
        "uploaded_at": timestamp,
        "post_condition" : "Awaiting Approval"  
    }
    table_client.upsert_entity(entity)

    for role , image_name in image_dict.items():
        entity = {
            "PartitionKey": post_id,
            "RowKey": role,
            "image_id": image_name,
            "uploaded_at": timestamp
        }
        table_client.upsert_entity(entity)

def add_road_condition(post_id, road_condition):
    """
    Add or update the road condition for a post in Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        entity = next(table_client.query_entities(f"PartitionKey eq '{post_id}' and RowKey eq 'metadata'"))
        entity["road_condition"] = road_condition
        table_client.update_entity(entity)
        logging.info(f"Road condition for '{post_id}' updated to '{road_condition}'.")
        return True
    except Exception as e:
        logging.error(f"Failed to update road condition for '{post_id}': {e}")
        return False

def add_post_bid(post_id,current_bid,current_bidder_id):
    pass

def update_post_condition(post_id, condition):
    """
    Update the post condition in Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        entity = next(table_client.query_entities(f"PartitionKey eq '{post_id}' and RowKey eq 'metadata'"))
        entity["post_condition"] = condition
        table_client.update_entity(entity)
        logging.info(f"Post condition for '{post_id}' updated to '{condition}'.")
        return True
    except Exception as e:
        logging.error(f"Failed to update post condition for '{post_id}': {e}")
        return False
    
def fetch_post(post_id):
    """
    Fetch post metadata from Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        entitries = table_client.query_entities(f"PartitionKey eq '{post_id}'")
        resp = {}
        for entity in entitries:
            if entity["RowKey"] == "metadata":
                    resp["landmark"] = entity.get("landmark", "")
                    resp["coordinates"] = entity.get("coordinates", "")
                    resp["uploaded_at"] = entity.get("uploaded_at", "")
                    resp["road_condition"] = entity.get("road_condition", "")
                    resp["post_condition"] = entity.get("post_condition", "")
            elif entity["RowKey"] in ["front", "left", "right", "back"]:
                    role = entity["RowKey"]
                    image_id = entity.get("image_id", "")
                    resp[role] = {
                        "image_id": image_id,
                    }
            elif entity["RowKey"] == "static_metadata":
                dict_str = entity.get("static_metadata", "{}")
                resp["staic_metadata"] = json.loads(dict_str) if dict_str else {}
            elif entity["RowKey"] == "bid_amount":
                resp["amount"] = entity.get("bid_amount", 0)

        return resp
    except Exception as e:
        logging.error(f"Failed to fetch metadata for '{post_id}': {e}")
        return None
    
def fetch_all_posts():
    """
    Fetch all posts from Azure Table Storage and return structured JSON.
    Each post includes metadata and associated image info.
    """

    try:
        
        connection_string = os.getenv("STORAGE_CONNECTION_STRING")
        table_service_client = TableServiceClient.from_connection_string(connection_string)
        table_client = table_service_client.get_table_client("posts")
        grouped = defaultdict(lambda: {"image": {}})
        for entity in table_client.list_entities():
            pk = entity["PartitionKey"]
            rk = entity["RowKey"]
            if pk.startswith("post_"):
                try:
                    post_id = pk
                except ValueError:
                    continue  
            else:
                continue
            
            grouped[pk]["post_id"] = post_id

            if rk == "metadata":
                grouped[pk]["username"] = entity.get("username","")
                grouped[pk]["coordinates"] = entity.get("coordinates", "")
                grouped[pk]["landmark"] = entity.get("landmark", "")
                grouped[pk]["uploaded_at"] = entity.get("uploaded_at", "1970-01-01T00:00:00")
                grouped[pk]["post_condition"] = entity.get("post_condition", "")
            elif rk in ["front", "back", "left", "right"]:
                grouped[pk]["image"][rk] = {
                    "image_id": entity.get("image_id", ""),
                    "uploaded_at": entity.get("uploaded_at", "")
                }
            elif rk == "static_metadata":
                grouped[pk]["static_metadata"] = entity.get("static_metadata", {})
            elif rk == "bid_amount":
                grouped[pk]["amount"] = entity.get("bid_amount", 0)
        post_list = list(grouped.values())
        post_list.sort(
            key=lambda post: datetime.fromisoformat(post.get("uploaded_at").replace("Z", "+00:00")),
            reverse=True
        )
        return post_list
    except Exception as e:
        logging.error(f"Error fetching posts: {e}")
        return {"error": str(e)}
    
def register_entity(userName, userUsername, role, address):
    """
    Registers a user, agency, or contractor into Azure Table Storage.
    
    :param userName: Full name of the user/agency/contractor
    :param userUsername: Unique username
    :param role: One of ['User', 'Agency', 'Contractor']
    :param address: Wallet address
    :return: dict (registration result)
    """

    if role.lower() not in ["user", "agency", "contractor"]:
        return {"success": False, "message": "INV_ROLE"}

   
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    if not connection_string:
        return {"success": False, "message": "Azure connection string is missing."}
    
    try:
        table_service = TableServiceClient.from_connection_string(connection_string)
        table_name = "users" if role.lower() == "user" else "agencies" if role.lower() == "agency" else "contractors"
        table_client = table_service.get_table_client(table_name)
    except Exception as e:
        return {"success": False, "message": f"Error initializing Azure Table service: {str(e)}"}

    
    address_field = f"{role.lower()}Address"
    name_field = f"{role.lower()}Name"
    username_field = f"{role.lower()}Username"

    entity = {
        "PartitionKey": role,
        "RowKey": userUsername,
        address_field: address,
        name_field: userName,
        username_field: userUsername
    }

    
    try:
        duplicates = list(table_client.query_entities(
            query_filter=f"RowKey eq '{userUsername}'"
        ))
        if duplicates:
            return {"success": False, "message": f"DUP_REG"}
    except Exception as e:
        return {"success": False, "message": f"Error querying Azure Table: {str(e)}"}

    
    try:
        table_client.create_entity(entity=entity)
        return {"success": True, "message": f"{role} '{userUsername}' registered successfully."}
    except ResourceExistsError:
        return {"success": False, "message": "DUP_USER"}
    except HttpResponseError as e:
        return {"success": False, "message": f"Azure Table error: {str(e)}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {str(e)}"}
    

def checkAddressInUsers(username):
    """
    Check if the address is already registered in the Users table.
    :param username: The username to check
    :return: dict (check result)
        """
    
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service.get_table_client("users")

    try:
        entities = list(table_client.query_entities(f"userAddress eq '{username}'"))
        if entities:
            logging.log(logging.INFO, f"Address for username '{username}' already exists in Users table.")
            return True
        else:
            return False
    except Exception as e:
        logging.log(logging.ERROR, f"Error checking address in Users table: {str(e)}")
        return False

def checkAddressInAgency(username):
    """
    Check if the address is already registered in the Agency table.
    
    :param username: The username to check
    :return: dict (check result)
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service.get_table_client("agencies")

    try:
        entities = list(table_client.query_entities(f"agencyAddress eq '{username}'"))
        if entities:
            logging.log(logging.INFO, f"Address for username '{username}' already exists in Agency table.")
            return True
        else:
            return False
    except Exception as e:
        logging.log(logging.ERROR, f"Error checking address in Agency table: {str(e)}")
        return False

def checkAddressInContractor(username):
    """
    Check if the address is already registered in the Contractor table.
    
    :param username: The username to check
    :return: dict (check result)
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service.get_table_client("contractors")

    try:
        entities = list(table_client.query_entities(f"contractorAddress eq '{username}'"))
        if entities:
            logging.log(logging.INFO, f"Address for username '{username}' already exists in Contractor table.")
            return True
        else:
            return False
    except Exception as e:
        logging.log(logging.ERROR, f"Error checking address in Contractor table: {str(e)}")
        return False

def fetch_user_details(address, role):
    """
    Fetch user details from Azure Table Storage based on username and role.
    
    :param username: The username to fetch details for
    :param role: One of ['User', 'Agency', 'Contractor']
    :return: dict (user details)
    """
    
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service = TableServiceClient.from_connection_string(connection_string)
    
    if role.lower() == "user":
        table_name = "users"
    elif role.lower() == "agency":
        table_name = "agencies"
    elif role.lower() == "contractor":
        table_name = "contractors"
    else:
        return {"success": False, "message": "Invalid role"}

    table_client = table_service.get_table_client(table_name)
    try:
        entities = list(table_client.query_entities(f"{role.lower()}Address eq '{address}'"))
        if not entities:
            return {"success": False, "message": "User not found"}
        
        user_details = entities[0]
        return {
            "success": True,
            "userName": user_details.get(f"{role.lower()}Name", ""),
            "userUsername": user_details.get(f"{role.lower()}Username", ""),
            "address": user_details.get(f"{role.lower()}Address", "")
        }
    except Exception as e:
        logging.error(f"Error fetching user details for '{address}': {str(e)}")
        return {"success": False, "message": f"Error fetching user details: {str(e)}"}

    
def build_static_metadata(lat, lon,length, road_width,
                           maintenance_history,road_surface, 
                           road_geometry, road_safety_features,
                           PCI, RQI, BBD_deflection):
    
    street, formatted_address = get_street_name_and_address(lat, lon)
    soil_data = ""#get_soil_properties(lat, lon)
    pop_density = get_population_density_from_tif(lat, lon)

    return {
        "street_name": street,
        "address": formatted_address,
        "soil": soil_data,
        "population_density_km2": pop_density,
        "length": length,
        "road_width": road_width,
        "maintenance_history": maintenance_history,
        "road_surface": road_surface,
        "road_geometry": road_geometry,
        "road_safety_features": road_safety_features,
        "PCI": PCI,
        "RQI": RQI,
        "BBD_deflection": BBD_deflection,
    }

def upload_static_metadata(post_id, lat, lon,length, road_width,
                           maintenance_history,road_surface, 
                           road_geometry, road_safety_features,
                           PCI, RQI, BBD_deflection):
    """
    Upload static metadata to Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    timestamp = datetime.now(timezone.utc).isoformat()

    static_metadata = build_static_metadata(lat, lon,length, road_width,
                           maintenance_history,road_surface, 
                           road_geometry, road_safety_features,
                           PCI, RQI, BBD_deflection)
    
    logging.log(logging.INFO, f"Uploading static metadata for post {post_id}: {static_metadata}")
    
    entity = {
        "PartitionKey": post_id,
        "RowKey": "static_metadata",
        "static_metadata": json.dumps(static_metadata),
        "uploaded_at": timestamp
    }

    table_client.upsert_entity(entity)

def get_coordinates(postid):
    """
    Fetch coordinates for a given post ID from Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        entity = next(table_client.query_entities(f"PartitionKey eq '{postid}' and RowKey eq 'metadata'"))
        coordinates = entity.get("coordinates", "")
        if coordinates:
            lat, lon = map(float, coordinates.split(","))
            return {"lat": lat, "lon": lon}
        else:
            return {"error": "Coordinates not found"}
    except StopIteration:
        return {"error": "Post not found"}
    except Exception as e:
        logging.error(f"Error fetching coordinates for post '{postid}': {e}")
        return {"error": str(e)}
    
def get_post_static_report(postid):
    """
    Fetch static metadata for a given post ID from Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        entity = next(table_client.query_entities(f"PartitionKey eq '{postid}' and RowKey eq 'static_metadata'"))
        static_metadata = entity.get("static_metadata", "{}")
        return json.loads(static_metadata) if static_metadata else {}
    except StopIteration:
        return {"error": "Post not found"}
    except Exception as e:
        logging.error(f"Error fetching static metadata for post '{postid}': {e}")
        return {"error": str(e)}

def get_report_dict(coordinates, metadata_report):
    report = metadata_report
    # logging.log(logging.INFO, f"Metadata report for coordinates {coordinates}: {report}")
    report["road_traffic"] = get_road_traffic_analysis(coordinates['lat'], coordinates['lon'])
    # logging.log(logging.INFO, f"Road traffic analysis for coordinates {coordinates}: {report['road_traffic']}")
    report["weather_forcast"] = parse_weather_forcast(coordinates['lat'],coordinates['lon'])
    # logging.log(logging.INFO, f"Weather forecast for coordinates {coordinates}: {report['weather_forcast']}")

    return report

def generate_report(postid):
    coordinates = get_coordinates(postid)
    # logging.log(logging.INFO, f"Coordinates for post {postid}: {coordinates}")
    metadata_report = get_post_static_report(postid)
    # logging.log(logging.INFO, f"Static metadata for post {postid}")
    report_dict = get_report_dict(coordinates, metadata_report)
    # logging.log(logging.INFO, f"Report dictionary for post {postid}")
    openai = OpenAIChat()
    # logging.log(logging.INFO, f"Generating report using OpenAIChat for post {postid}")
    md_report = openai.chat_completion(report_dict)
    return md_report

def update_add_bid_ammount(postid,ammount):
    """
    Update the bid amount for a post in Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        # check for a seperate entrity with rowkwy as "bid_amount" and partition key as postid
        entity = next(table_client.query_entities(f"PartitionKey eq '{postid}' and RowKey eq 'bid_amount'"), None)
        if entity:
            # Update existing bid amount
            entity["bid_amount"] = ammount
            table_client.update_entity(entity)
        else:
            # Create new bid amount entry
            entity = {
                "PartitionKey": postid,
                "RowKey": "bid_amount",
                "bid_amount": ammount
            }
            table_client.create_entity(entity)
        logging.info(f"Bid amount for '{postid}' updated to {ammount}.")
        return True
       
    except Exception as e:
        logging.error(f"Failed to update bid amount for '{postid}': {e}")
        return False
    
def delete_post(postid):
    """
    Delete a post and its associated images from Azure Table Storage.
    """
    connection_string = os.getenv("STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(connection_string)
    table_client = table_service_client.get_table_client("posts")

    try:
        # Delete all entities with the given PartitionKey
        entities = table_client.query_entities(f"PartitionKey eq '{postid}'")
        for entity in entities:
            table_client.delete_entity(partition_key=entity["PartitionKey"], row_key=entity["RowKey"])
        logging.info(f"Post '{postid}' and  deleted successfully.")
        #image need to deleted also
        return True
    except Exception as e:
        logging.error(f"Failed to delete post '{postid}': {e}")
        return False
