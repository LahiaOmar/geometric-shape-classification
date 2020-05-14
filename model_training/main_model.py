from utils import read_data, get_cnn_model
import tensorflow as tf
import numpy as np


## reading the data : 

PATH='./data set'
DICT_LABELS = {"cercle": 0, "line": 1, "rect": 2, "triangle": 3}
train, train_label = read_data(path=PATH, dict_labels=DICT_LABELS)

train = np.array(train)
train_label = np.array(train_label)

## Create the model

model = get_cnn_model()

model.fit(train, train_label, epochs=10, batch_size=15)

## saving our model

DIR_NAME = "./models_save/"
VERSION = "V2"
MODEL_NAME = "tf_cnn_"

model.save(DIR_NAME + MODEL_NAME + VERSION)

