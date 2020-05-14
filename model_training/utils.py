import numpy as np
import os
import cv2 as cv
from PIL import Image
import tensorflow as tf


def show_img(img, msg="img"):
    cv.imshow("img", img)
    cv.waitKey()

def cropping(image, margin, diff):
    where = np.where(image != diff)
    x_min, x_max, y_min, y_max = 9999999, -1, 9999999, -1
    for x, y in zip(where[0], where[1]):
        x_min = min(x, x_min)
        x_max = max(x, x_max)
        y_min = min(y, y_min)
        y_max = max(y, y_max)
    if x_min == 9999999 or x_max == -1 or y_min == 9999999 or y_max == -1:
        return None
    crop = []
    x_min = max(0, x_min - margin)
    x_max = min(440, x_max + margin)
    y_min = max(0, y_min - margin)
    y_max = min(440, y_max + margin)
    crop = image[x_min: x_max, y_min: y_max]
    crop = cv.resize(crop, dsize=(80, 80))
    crop = np.resize(crop, (80, 80, 1))
    return crop

def read_data(path, dict_labels):    
    train = []
    train_label = []
    for dr in os.listdir(path):
        for cur_img in os.listdir(path + "/" + dr):
            if cur_img.split(".")[-1] != "png":
                continue
            img = Image.open(path + "/" + dr + "/" + cur_img).convert("L")
            img = np.asarray(img)
            crop = cropping(img, 20, 255)
            if crop is None:
                continue
            train.append(crop)
            train_label.append(dict_labels[dr])

    return train, train_label


def get_cnn_model():
    
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(10, 3, input_shape=(80, 80, 1), activation="relu"),
        tf.keras.layers.MaxPool2D(),
        tf.keras.layers.Conv2D(10, 2, activation="relu"),
        tf.keras.layers.MaxPool2D(),
        tf.keras.layers.Conv2D(10, 3, activation="relu"),
        tf.keras.layers.MaxPool2D(),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(500, activation="relu"),
        tf.keras.layers.Dense(4)
    ])
    model.compile(optimizer="adam",
              loss=tf.keras.losses.SparseCategoricalCrossentropy(
                  from_logits=True),
              metrics=['accuracy'])
    return model

if __name__ == "__main__":
    pass