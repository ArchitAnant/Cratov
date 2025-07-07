import torch
from PIL import Image
from torchvision import transforms
from prediction.model import get_model
import os

class ModelWrapper:
    def __init__(self):
        self.model = get_model()
        self.model.load_state_dict(torch.load("pothole_model.pth", map_location="cpu",weights_only=False))
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Grayscale(num_output_channels = 1),
            transforms.Resize(128),
            transforms.CenterCrop(128),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5])
        ])

    def predict(self, image_bytes):
        img = Image.open(image_bytes).convert("L")
        transformed_img = self.transform(img).unsqueeze(0)
        with torch.inference_mode():
            logit = self.model(transformed_img)

        prob = torch.sigmoid(logit)

        prediction_class = "SVD" #Severe Damage

        if prob<=0.2:
            prediction_class = "NML" #Normal
        elif prob>0.2 and prob<=0.6:
            prediction_class = "ACPT" #Acceptable
        elif prob>0.6 and prob<=0.8:
            prediction_class = "DMG" #Damage

        return {"pdt_tag":prediction_class, "pdt_prob" : prob.item()}
