import sys
import json
import scipy.io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2
import scipy.io
import numpy as np
from datetime import datetime, timedelta
import time
import tensorflow as tf
import keras
import keras.utils as image
from keras.callbacks import ModelCheckpoint,EarlyStopping
from keras.layers import Dense, Activation, Dropout, Flatten, Input, Convolution2D, ZeroPadding2D, MaxPooling2D, Activation
from keras.layers import Conv2D, AveragePooling2D
from keras.models import Model, Sequential
from keras import metrics
from keras.models import model_from_json
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import cv2
import pandas as pd
from keras.models import model_from_json
from deepface.commons import distance


def loadVggFaceModel():
    model = Sequential()
    model.add(ZeroPadding2D((1,1),input_shape=(224,224, 3)))
    model.add(Convolution2D(64, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2,2), strides=(2,2)))

    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(128, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2,2), strides=(2,2)))

    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(256, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(256, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(256, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2,2), strides=(2,2)))

    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2,2), strides=(2,2)))

    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(ZeroPadding2D((1,1)))
    model.add(Convolution2D(512, (3, 3), activation='relu'))
    model.add(MaxPooling2D((2,2), strides=(2,2)))

    model.add(Convolution2D(4096, (7, 7), activation='relu'))
    model.add(Dropout(0.5))
    model.add(Convolution2D(4096, (1, 1), activation='relu'))
    model.add(Dropout(0.5))
    model.add(Convolution2D(2622, (1, 1)))
    model.add(Flatten())
    model.add(Activation('softmax'))
    
    vgg_face_descriptor = Model(inputs=model.layers[0].input, outputs=model.layers[-2].output)
    return vgg_face_descriptor


def main(uploadedImage, gender):

    mat = scipy.io.loadmat('./imdb_files2/imdb')
    instances = mat['imdb'][0][0][0].shape[1]
    df = pd.read_pickle('./FacialNNDF.pkl')

    df.drop(df[(df['name'] == "Casey Wilson") | (df['name'] == "Aunjanue Ellis") | (df['name'] == "Sophia Bush") | (df['name'] == "Patricia Heaton")].index, inplace = True) #delete mismatched data

    if (gender == "Male"):
        df = df[df['gender'] == 1]

    if (gender == "Female"):
        df = df[df['gender'] == 0]

    facefilepath = uploadedImage #'photo.jpg'

    model = loadVggFaceModel()
    model.load_weights('./vgg_face_weights.h5')
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    img = cv2.imread('./upload/'+ facefilepath) #pixel values in scale of 0-255

    faces = face_cascade.detectMultiScale(img, 1.3, 5)

    for (x,y,w,h) in faces:
        detected_face = img[int(y):int(y+h), int(x):int(x+w)]
        try:
            margin = 10
            margin_x = int((w * margin)/100); margin_y = int((h * margin)/100)
            detected_face = img[int(y-margin_y):int(y+h+margin_y), int(x-margin_x):int(x+w+margin_x)]
        except:
            print(json.dumps('No face was recognized, please try again with a different file.'))#print("detected face has no margin")
        
        detected_face = cv2.resize(detected_face, (224, 224))
        img_pixels = image.img_to_array(detected_face)
        img_pixels = np.expand_dims(img_pixels, axis = 0)
        img_pixels /= 127.5
        img_pixels -= 1
        yourself_representation = model.predict(img_pixels, verbose = 0)[0,:]

    distance1 = []


    for index in df.index:
        distance1.append(distance.findCosineDistance(df['face_vector_raw'][index],yourself_representation))


    df['similarity']=distance1
    df = df.sort_values(by=['similarity'], ascending=True)
    pivot_df = df.drop_duplicates(subset="celebrity_name")
    pivot_df = pivot_df[pivot_df['face_score']>=3.5]


    arr = [] #initialize empty array to return


    for i in range(0, 8): #6
        instance = pivot_df.iloc[i]
        name = instance['celebrity_name']
        similarity = instance['similarity']
        similarity = (1 - similarity)*100
        full_path = instance['full_path'][0]
       
        tempArr = [full_path, name, round(similarity, 2)]
        arr.append(tempArr)
    print(json.dumps(arr))



if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])