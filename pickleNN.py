import sys
import json
import scipy.io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2
from deepface import DeepFace
from deepface.commons import distance

def main(uploadedImage):
    print(uploadedImage)

    mat = scipy.io.loadmat('C:/Users/steve/Downloads/imageData/imdb_crop/imdb')
    instances = mat['imdb'][0][0][0].shape[1]
    df = pd.read_pickle('C:/Users/steve/BigDataPage/FacialNNDFtest3.pkl')
    testfacefilepath = uploadedImage #'photo.jpg'
    img = cv2.imread('C:/Users/steve/downloads/'+testfacefilepath)
    # plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    initial_representation = DeepFace.represent(img_path = 'C:/Users/steve/downloads/'+testfacefilepath,model_name="VGG-Face", detector_backend="opencv")
    yourself_representation = initial_representation[0]["embedding"]
    from deepface.commons import distance
    distance1 = []

    for index in df.index:
        distance1.append(distance.findCosineDistance(df['face_vector_raw'][index],yourself_representation))

    df['similarity']=distance1
    df = df.sort_values(by=['similarity'], ascending=True)
    pivot_df = df.drop_duplicates(subset="celebrity_name")
    pivot_df = pivot_df[pivot_df['face_score']>=3.5]

    arr = [] #initialize empty array to return

    for i in range(0, 5): #6
        instance = pivot_df.iloc[i]
        name = instance['celebrity_name']
        similarity = instance['similarity']
        
        similarity = (1 - similarity)*100
        
        #img = instance['pixels']
        full_path = instance['full_path'][0]
        img = cv2.imread("C:/Users/steve/Downloads/imageData/imdb_crop/%s" % full_path)
        
        tempArr = [full_path, name, similarity]
        arr.append(tempArr)
        # print(full_path, name, similarity)
    print(json.dumps(arr))


if __name__ == '__main__':
    main(sys.argv[1])
