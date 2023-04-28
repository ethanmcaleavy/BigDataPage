FROM python:3.8

WORKDIR /BIGDATAPAGE

COPY requirements.txt .

RUN pip install -r requirements.txt &&\
    apt-get update || : && apt-get install python -y  && apt-get update && apt-get install -y nodejs npm

COPY . .

CMD ["npm", "start"]

