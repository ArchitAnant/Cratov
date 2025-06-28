import azure.functions as func
import json
import logging
import io
from HttpTrigger.inference import ModelWrapper
import base64

app = func.FunctionApp()

@app.route(route="predictPothole", auth_level=func.AuthLevel.FUNCTION)
def predictPothole(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Trigger function triggered to predict potholes.')
    try:
        request_body = req.get_json()

        if not request_body or 'image' not in request_body:
            return func.HttpResponse(
                json.dumps({"error": "Invalid request. 'image' field is required."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        base64_image = request_body['image']
        image_bytes = base64.b64decode(base64_image)
        image = io.BytesIO(image_bytes)
        model = ModelWrapper()
        result = model.predict(image)
        data = {
            "pdt_tag": result["pdt_tag"],
            "pdt_prob": result["pdt_prob"]
        }
        return func.HttpResponse(
            json.dumps(data),
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