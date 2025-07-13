import azure.functions as func
import json
import logging
from prediction.inference import ModelWrapper
from utils import * #get_image_from_blob,fetch_images,generate_post_id,upload_image_to_blob,generate_image_id,upload_post_to_table
import os
import ast

app = func.FunctionApp()
model = ModelWrapper()

@app.route(route="health", auth_level=func.AuthLevel.ANONYMOUS)
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """
    Health check endpoint to verify if the function app is running.
    """
    logging.info('Health check triggered.')
    try:
        return func.HttpResponse(
            json.dumps({"status": "healthy"}),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    except Exception as e:
        logging.error(f"Error in health check: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": "Internal Server Error"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

@app.route(route="predictPothole", auth_level=func.AuthLevel.FUNCTION)
def predictPothole(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to predict potholes.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        post_id = req.params.get('postid')
        print(f"Received post_id: {post_id}")

        if not post_id:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'postid' field is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        image_list = fetch_images(post_id)
        image_dict = get_image_from_blob(image_list)

        image_keys = list(image_dict.keys())
        image_datas = list(image_dict.values())

        img_dict = {}


        for i in range(len(image_keys)):            
            result = model.predict(image_datas[i])
            data = {
                "pdt_tag": result["pdt_tag"],
                "pdt_prob": result["pdt_prob"]
            }
            img_dict[image_keys[i]] = data
        

        return func.HttpResponse(
            json.dumps(img_dict),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
        
    except Exception as e:
        return func.HttpResponse(
                json.dumps({"error": f"Internal Server Error: {str(e)}"}),
                status_code=500,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    
@app.route(route="uploadPost", auth_level=func.AuthLevel.FUNCTION)
def upload_post(req: func.HttpRequest) -> func.HttpResponse:
    """
    recives a post request with the following json body:
    {
        "landmark": "string",
        "coordinates": "string",
        "userID": "string",
        "img1": {
            "data": "base64 encoded image data",
            "name": "image1.jpeg"
        },
        "img2": {       
            "data": "base64 encoded image data",
            "name": "image2.jpeg"
        },
        "img3": {
            "data": "base64 encoded image data",
            "name": "image3.jpeg"
        },
        "img4": {
            "data": "base64 encoded image data",
            "name": "image4.jpeg"
    }

    """
    logging.info('Trigger function triggered to upload post.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        
        resp_json = req.get_json()
        if not resp_json:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

        landmark = resp_json.get("landmark", "Unknown")
        coordinates = resp_json.get("coordinates", "0,0")  # Default to "
        user_id = resp_json.get("userID")
        img1_raw = resp_json.get("img1")
        img1 = img1_raw.get("data")
        img1_name = img1_raw.get("name")
        img2_raw = resp_json.get("img2")
        img2 = img2_raw.get("data")
        img2_name = img2_raw.get("name")
        img3_raw = resp_json.get("img3")
        img3 = img3_raw.get("data")
        img3_name = img3_raw.get("name")
        img4_raw = resp_json.get("img4")
        img4 = img4_raw.get("data")
        img4_name = img4_raw.get("name")
        accepted_formats = [".jpeg",".jpg"]

        ext1 = os.path.splitext(img1_name)[1].lower()
        ext2 = os.path.splitext(img2_name)[1].lower()
        ext3 = os.path.splitext(img3_name)[1].lower()
        ext4 = os.path.splitext(img4_name)[1].lower()

        check = (
            ext1 in accepted_formats and
            ext2 in accepted_formats and
            ext3 in accepted_formats and
            ext4 in accepted_formats
        )

        if check :
            pass
        else:
            return func.HttpResponse(
                json.dumps({"error": "Invalid image format. Only JPEG/JPG images are accepted."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

        if not img1 or not img2 or not img3 or not img4:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. All image fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        logging.info(f"Coodinate {coordinates}")
        post_id = generate_post_id(user_id)
        image_dict = {}
        images = [img1, img2, img3, img4]
        role = ["front", "left", "right", "back"]
        for idx in range(len(images)):
            image_id = generate_image_id(user_id)
            image_name = f"{image_id}.jpeg"
            image_dict[role[idx]] = image_name
            if upload_image_to_blob(images[idx],image_name):
                logging.log(logging.INFO, f"Image {role[idx]} uploaded successfully for post {post_id}")
            else:
                logging.log(logging.ERROR, f"Failed to upload image {role[idx]} for post {post_id}")

        upload_post_to_table(post_id, user_id, landmark, coordinates, image_dict)


        return func.HttpResponse(
            json.dumps({"postID": post_id}),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
         
    except Exception as e:
        print(f"Error in upload_post: {str(e)}")
        return func.HttpResponse(
                json.dumps({"error": f"Internal Server Error: {str(e)}"}),
                status_code=500,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    
    
@app.route(route="fetch_post", auth_level=func.AuthLevel.FUNCTION)
def fetch_posts(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing fetch_post request.')

    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )

        posts = fetch_all_posts()

        return func.HttpResponse(
            json.dumps(posts, indent=2),
            status_code=200,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )

    except Exception as e:
        logging.error(f"Internal Server Error: {e}")
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )

@app.route(route="register", auth_level=func.AuthLevel.FUNCTION)
def register_entity_http(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(" Received registration request.")

    
    if req.method == "OPTIONS":
        return func.HttpResponse(
            "",
            status_code=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        )

    try:
        data = req.get_json()


        userName = data.get("userName").strip()
        userUsername = data.get("userUsername").strip()
        role = data.get("role").strip()
        address = data.get("address").strip()

       
        if not all([userName, userUsername, role, address]):
            return func.HttpResponse(
                json.dumps({"success": False, "message": "Missing required fields."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

       
        result = register_entity(userName, userUsername, role, address)

        return func.HttpResponse(
            json.dumps(result),
            status_code=200 ,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    except Exception as e:
        logging.error(f"Unexpected error during registration: {e}")
        return func.HttpResponse(
            json.dumps({"success": False, "message": f"Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
@app.route(route="checkRegister", auth_level=func.AuthLevel.FUNCTION)
def check_registered_user(req: func.HttpRequest) -> func.HttpResponse:
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        address = req.params.get('address')

        if not address:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'address' field is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        if checkAddressInUsers(address) :
            return func.HttpResponse(
                json.dumps({"registered": True, "role": "user"}),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
        if checkAddressInAgency(address):
            return func.HttpResponse(
                json.dumps({"registered": True, "role": "agency"}),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
        if checkAddressInContractor(address):
            return func.HttpResponse(
                json.dumps({"registered": True, "role": "contractor"}),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
        else:
            return func.HttpResponse(
                json.dumps({"registered": False}),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
        

    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )

@app.route(route="fetchUserDetails", auth_level=func.AuthLevel.FUNCTION)
def get_user_details(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to fetch user details.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        parms_json = req.get_json()
        if not parms_json:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        address = parms_json.get("address")
        user = parms_json.get("role")

        user_details = fetch_user_details(address, user)

        return func.HttpResponse(
            json.dumps(user_details),
            status_code=200,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )

        if not address or not user:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'address' and 'user' fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )


@app.route(route="addRoadCondition", auth_level=func.AuthLevel.FUNCTION)
def addRoadCondition(req : func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to add road condition.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )

        resp_json = req.get_json()
        if not resp_json:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        post_id = resp_json.get("postID")
        road_condition = resp_json.get("roadCondition")
        logging.info(f"Received post_id: {post_id} and road_condition: {road_condition}")
        if not post_id or not road_condition:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'postID' and 'roadCondition' fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        if add_road_condition(post_id, road_condition):
            return func.HttpResponse(
                json.dumps({"message": "Road condition updated successfully."}),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Failed to update road condition."}),
                status_code=500,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
@app.route(route="updatePostCondition", auth_level=func.AuthLevel.FUNCTION)
def updatePostCondition(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to update post condition.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        
        resp_json = req.get_json()
        if not resp_json:
            logging.error("Invalid request. JSON body is required.")
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        post_id = resp_json.get("postID")
        condition = resp_json.get("condition")

        if not post_id or not condition:
            logging.error("Invalid request. 'postID' and 'condition' fields are required.")
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'postID' and 'condition' fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

        if update_post_condition(post_id, condition):
            return func.HttpResponse(
                json.dumps({"message": "Post condition updated successfully."}),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Failed to update post condition."}),
                status_code=500,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
@app.route(route="fetchPost", auth_level=func.AuthLevel.FUNCTION)
def fetchPost(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to fetch post.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        
        post_id = req.params.get('postid')
        if not post_id:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'postid' field is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

        resp = fetch_post(post_id)
        if resp:
            return func.HttpResponse(
                json.dumps(resp),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Post not found."}),
                status_code=404,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

@app.route(route="fetchImages", auth_level=func.AuthLevel.FUNCTION)
def fetchImages(req: func.HttpRequest) -> func.HttpResponse:   
    logging.info('Trigger function triggered to fetch images.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
         
        post_id = req.params.get('postid')
        if not post_id:
             return func.HttpResponse(
                    json.dumps({"error": "Invalid request. 'postid' field is required."}),
                    status_code=400,
                    mimetype="application/json",
                    headers={"Access-Control-Allow-Origin": "*"}
             )
        image_list = fetch_images(post_id)
        image_dict = get_image_from_blob(image_list)

        if not image_dict:
            return func.HttpResponse(
                json.dumps({"error": "Unable to fetch images for the given post ID."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        encoded_images = {}

        for name, stream in image_dict.items():  # ✅ Use .items() for dict iteration
            if stream is None:
                encoded_images[name] = None
            else:
                stream.seek(0)
                b64_str = base64.b64encode(stream.read()).decode("utf-8")
                encoded_images[name] = b64_str

        return func.HttpResponse(
            json.dumps(encoded_images),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

        
    except Exception as e:
        logging.log(logging.ERROR, f"Error in fetchImages: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )   


@app.route(route="uploadPostMetadata", auth_level=func.AuthLevel.FUNCTION)
def uploadPostMetadata(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to upload post metadata.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        
        resp_json = req.get_json()
        if not resp_json:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        post_id = resp_json.get("postID")
        lat = resp_json.get("lat")
        lon = resp_json.get("lon")
        road_dim = resp_json.get("roadDimensions")
        length = road_dim.split(",")[0] if road_dim else None
        road_width = road_dim.split(",")[1] if road_dim and len(road_dim.split(",")) > 1 else None
        maintenance_history = resp_json.get("maintenanceHistory")
        road_surface = resp_json.get("roadSurface")
        road_geometry = resp_json.get("roadGeometry")
        road_safety_features = resp_json.get("safetyFeature")
        PCI = resp_json.get("pci")
        RQI = resp_json.get("rqi")
        BBD_deflection = resp_json.get("bbd")
        max_bid = resp_json.get("maxBidAmount")
#         {
#   "postID": "post_vivek10_202507133758_1889",
#   "lat": 22.577152,
#   "lon": 88.39168,
#   "roadDimensions": "900,300",
#   "maintenanceHistory": "No maintenance history",
#   "roadSurface": "Asphalt",
#   "roadGeometry": "Straight but slightly tilted vertically",
#   "safetyFeature": "Non",
#   "pci": "78",
#   "rqi": "0.6",
#   "bbd": "0.6",
#   "maxBidAmount": "500000"
# }

        if not post_id or not lat or not lon or not length or not road_width or not maintenance_history or not road_surface or not road_geometry or not road_safety_features or not PCI or not RQI or not BBD_deflection:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. All fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )

        upload_static_metadata(post_id, lat, lon, length, road_width,
                               maintenance_history, road_surface, 
                               road_geometry, road_safety_features,
                               PCI, RQI, BBD_deflection)
        update_add_bid_ammount(post_id,max_bid)

        return func.HttpResponse(
            json.dumps({"message": "Post metadata uploaded successfully."}),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

@app.route(route="generateReport", auth_level=func.AuthLevel.FUNCTION)
def generateReport(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to generate report.')
    try:
        if req.method == "OPTIONS":
            return func.HttpResponse(
                "",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )
        
        postid = req.params.get("postid")
        if not postid:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. JSON body is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        # coordinates = resp_json.get("coordinates")
        # metadata_report = resp_json.get("metadataReport")

        if not postid:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. postid fields are required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        # convert metadata_report to dict from string dict
        # converted_dict = ast.literal_eval(metadata_report)
        logging.info(f"Generating report for post ID: {postid}")


        report = generate_report(postid)
        logging.log(logging.INFO, f"Report generated for post ID")

        return func.HttpResponse(
            json.dumps({"report_md":report}),
            status_code=200,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": f"Internal Server Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

