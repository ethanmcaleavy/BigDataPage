from flask import Flask, jsonify
import numpy as np

app = Flask(__name__)

# @app.route('/start', methods = ['GET'])
# def start(): #implement this function if we need to initially run python code

@app.route('/getSimiliar', methods = ['GET'])
def getSimiliar():
    arr = np.array([['1.png', 'John John', '90.2'],['2.png', 'Bob John', '80.3'], #Example data 
                    ['3.jpg', 'Dog Bon', '73.2']])

    return jsonify({'message': arr.tolist()})

if __name__ == '__main__':
    app.run(host='localhost', port=8123)