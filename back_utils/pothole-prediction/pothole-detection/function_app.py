import azure.functions as func
import json
import logging
from HttpTrigger.inference import ModelWrapper
from utils import get_image_from_blob,fetch_images

app = func.FunctionApp()
model = ModelWrapper()

@app.route(route="predictPothole", auth_level=func.AuthLevel.FUNCTION)
def predictPothole(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to predict potholes.')
    try:
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