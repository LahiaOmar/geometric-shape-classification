from flask import Flask, render_template, url_for, request, make_response, jsonify
import base64
from PIL import Image
import numpy as np
import cv2 as cv
from tensorflow import keras
from model_training.utils import cropping

app = Flask(__name__)

FOLDER_PATH , MODEL_NAME = "./model_training/models_save/" , "tf_cnn_V2/"
DICT_LABELS = {0 :"Circle ", 1 : "Line" , 2 : "Rectangle", 3 : "Triangle"}
model = keras.models.load_model(FOLDER_PATH + MODEL_NAME)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/collect_data')
def collect_data():
    return render_template("collect_data.html")

@app.route('/prediction', methods=['POST'])
def prediction():
    print("prediction methods")
    data = request.get_json()
    img = data.replace("data:image/png;base64,", " ")
    decod = base64.b64decode(img)
    
    file_name = 'img.png'
    with open(file_name, 'wb') as f:
        f.write(decod)
    img_pred = np.array(Image.open(file_name).convert('L'))
    
    crop = cropping(img_pred, 20 , 255)
    if crop is None:
        return jsonify({"error" : "cropping problem",
                        "class" : "no class"                   
                    })
    
    crop = np.expand_dims(crop, axis=0)
    md_pred = model.predict(crop)

    index_max_pred = np.argmax(md_pred)
    pred =  DICT_LABELS[index_max_pred]

    return jsonify({"class" : pred,
                    "score" : str(md_pred[0][index_max_pred])
                })

if __name__ == "__main__":
    app.run(debug=True)
