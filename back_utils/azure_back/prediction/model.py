import torch
import torch.nn as nn
import torchvision.models as models
from torchvision.models import MobileNet_V2_Weights


def get_model():
    model = models.mobilenet_v2(weights=MobileNet_V2_Weights.IMAGENET1K_V2,progress=False)
    orig_conv = model.features[0][0]

    new_conv = nn.Conv2d(
        in_channels = 1,
        out_channels = orig_conv.out_channels,
        kernel_size = orig_conv.kernel_size,
        stride = orig_conv.stride,
        padding = orig_conv.padding,
        bias = orig_conv.bias is not None,
    )

    weights = torch.tensor([0.2989, 0.5870, 0.1140]).view(1, 3, 1, 1)

    with torch.inference_mode():
        new_conv.weight[:] = (orig_conv.weight * weights).sum(dim=1, keepdim=True)

    model.features[0][0] = new_conv

    model.classifier = nn.Sequential(
        nn.Dropout(0.2),
        nn.Linear(model.last_channel, 1)
    )

    for param in model.features.parameters():
        param.requires_grad = False
    
    return model

