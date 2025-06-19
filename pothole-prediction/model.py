import torch.nn as nn
import torchvision.models as models
from torchvision.models import MobileNet_V2_Weights


def get_model():
    model = models.mobilenet_v2(weights=MobileNet_V2_Weights.IMAGENET1K_V2,progress=False)

    model.classifier = nn.Sequential(
        nn.Dropout(0.2),
        nn.Linear(model.last_channel, 1)
    )
    for param in model.features.parameters():
        param.requires_grad = False

    return model

