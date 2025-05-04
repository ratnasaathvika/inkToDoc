# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_text
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        # Read image file as bytes
        image_bytes = file.read()
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        # Decode image
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        extracted_text = predict_text(image)

        return jsonify({'extracted_text': extracted_text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
