# Pothole Prediction Model
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1Ael37BkOZfL6wXLOeSZIjOlXClSypfZw?usp=sharing)

Download the [Pretrained Model](https://drive.google.com/file/d/1wd9xG4aQBSyn8yxE39z7HF2TH2BNBrsg/view?usp=share_link).


## Model

##### ~2.2 Million Parameters
Usign the pretrained `MobileNetV2()` followed by a

`Sequential`
- `Dropout`
- `Linear`

for classification.

Best Possible Image input size `128x128`.

Estimated Total Size `~50MB`.
It's important to keep the model size small.


## Data
https://www.kaggle.com/datasets/sachinpatel21/pothole-image-dataset/code

https://www.kaggle.com/datasets/andrewmvd/pothole-detection

https://www.kaggle.com/datasets/atulyakumar98/pothole-detection-dataset/data

https://www.kaggle.com/datasets/virenbr11/pothole-and-plain-rode-images

https://www.kaggle.com/datasets/danishasif/road-patches-dataset
