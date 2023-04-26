#!/usr/bin/env python
# coding: utf-8

# In[1]:


import scipy.io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2


# In[2]:


mat = scipy.io.loadmat('C:/Users/Computer/Documents/FacialRecNN/imdb_files2/imdb')


# In[3]:


instances = mat['imdb'][0][0][0].shape[1]


# In[4]:


df = pd.read_pickle('C:/Users/Computer/Documents/FacialRecNN/FacialNNDFtest3.pkl')


# In[6]:


from deepface import DeepFace
from deepface.commons import distance


# In[7]:


def findFaceRepresentation(img):
    try:
        representation = DeepFace.represent(img_path = img, model_name = "VGG-Face", detector_backend ="skip")
        outvec = representation[0]["embedding"]
    except:
        outvec = None
 
    return outvec


# In[96]:


#set name of test file
testfacefilepath = 'face10.jpg'


# In[97]:


#load image
img = cv2.imread('C:/Users/Computer/Documents/FacialRecNN/'+testfacefilepath)


# In[98]:


#show image
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))


# In[99]:


#use deepface to represent face as vector, then extract vector
initial_representation = DeepFace.represent(img_path = 'C:/Users/Computer/Documents/FacialRecNN/'+testfacefilepath,model_name="VGG-Face", detector_backend="opencv")
yourself_representation = initial_representation[0]["embedding"]


# In[100]:


from deepface.commons import distance


# In[101]:


#initialize distance column
distance1 = []

#get distances and append to distance column
for index in df.index:
    distance1.append(distance.findCosineDistance(df['face_vector_raw'][index],yourself_representation))


# In[102]:


df['similarity']=distance1


# In[103]:


#df.head()


# In[104]:


df = df.sort_values(by=['similarity'], ascending=True)


# In[105]:


if True:
    for i in range(0, 7):
        instance = df.iloc[i]
        name = instance['celebrity_name']
        similarity = instance['similarity']
        
        #img = instance['pixels']
        full_path = instance['full_path'][0]
        img = cv2.imread("C:/Users/Computer/Documents/FacialRecNN/imdb_files2/%s" % full_path)
        
        print(i,".",name," (",similarity,") - ",full_path)

        plt.axis('off')
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.show()

        print("-------------------------")


# In[108]:


pivot_df = df.drop_duplicates(subset="celebrity_name")
pivot_df = pivot_df[pivot_df['face_score']>=3.5]


# In[109]:


for i in range(0, 6):
    instance = pivot_df.iloc[i]
    name = instance['celebrity_name']
    similarity = instance['similarity']
    
    similarity = (1 - similarity)*100
    
    #img = instance['pixels']
    full_path = instance['full_path'][0]
    img = cv2.imread("C:/Users/Computer/Documents/FacialRecNN/imdb_files2/%s" % full_path)
    
    print(name," (",similarity,"%) - ",full_path)
    
    plt.axis('off')
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.show()
    
    print("-------------------------")


# In[ ]:




