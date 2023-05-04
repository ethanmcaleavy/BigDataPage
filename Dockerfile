FROM python:3.9

WORKDIR /BIGDATAPAGE

COPY requirements.txt .

RUN apt-get update && apt-get install -y python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install numpy pandas matplotlib opencv-python-headless deepface tensorflow keras scipy scikit-learn &&\
    apt-get update || : && apt-get install python -y  && apt-get update && apt-get install -y nodejs npm

COPY . .

CMD ["npm", "start"]

