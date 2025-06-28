import requests
import json
import base64
from dotenv import load_dotenv
import os

load_dotenv()
AZURE_KEY = os.getenv("AZURE_KEY")

def predict_image(image_path):
    url = f"https://waddle-dxhvhfaqahepfra6.centralindia-01.azurewebsites.net/api/predictpothole?code={AZURE_KEY}"
    headers = {"Content-Type": "application/json"}

    with open(image_path, "rb") as f:
        img_data = base64.b64encode(f.read()).decode("utf-8")

    payload = json.dumps({"image": img_data})
    response = requests.post(url, headers=headers, data=payload)

    return response.json()
