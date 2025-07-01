import azure.functions as func
import json
import logging
from HttpTrigger.inference import ModelWrapper
from utils import get_image_from_blob,fetch_images,generate_post_id,upload_image_to_blob,generate_image_id,upload_post_to_table
import os

app = func.FunctionApp()
model = ModelWrapper()

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

        upload_post_to_table(post_id, image_dict)


        return func.HttpResponse(
            json.dumps({"postID": post_id}),
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