import torch
import base64
import numpy as np
from PIL import Image

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
model = torch.load('./model.pth')
model.eval()


def transform_image():
    image = Image.open('digit_image.png')
    image = image.resize((28, 28))
    image.save('28_28.png')

    image = Image.open('28_28.png')
    image = np.array(image)
    image = image[..., 3]

    tensor = torch.from_numpy(image)
    tensor = tensor.view(1, 1, 28, 28)
    tensor = tensor.float()

    return tensor


def get_prediction():
    tensor = transform_image()

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    tensor = tensor.to(device)

    outputs = model.forward(tensor)
    _, y_hat = torch.max(outputs, 1)
    class_predicted = y_hat.item()

    return class_predicted


@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    if request.method == 'POST':
        data = request.data

        imgdata = base64.b64decode(data)
        filename = 'digit_image.png'

        with open(filename, "wb") as f:
            f.write(imgdata)

        class_predicted = get_prediction()

        return jsonify({'prediction': class_predicted})


if __name__ == '__main__':
    app.run()
