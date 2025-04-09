from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
from PIL import Image
import base64
import os
from textblob import TextBlob
from docx import Document

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output_docs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Configure Tesseract OCR path if necessary (For Windows Users)
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image_path):
    """Preprocess image for better OCR accuracy"""
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Resize image (Enlarge for better recognition)
    scale_percent = 200  # Increase size by 200%
    width = int(gray.shape[1] * scale_percent / 100)
    height = int(gray.shape[0] * scale_percent / 100)
    resized = cv2.resize(gray, (width, height), interpolation=cv2.INTER_LINEAR)
    
    # Apply Adaptive Thresholding to enhance contrast
    processed = cv2.adaptiveThreshold(resized, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 3)
    
    # Save processed image
    processed_path = os.path.join(UPLOAD_FOLDER, "processed.png")
    cv2.imwrite(processed_path, processed)
    
    return processed_path

def extract_text(image_path):
    """Extract text using Tesseract OCR"""
    text = pytesseract.image_to_string(Image.open(image_path), config="--psm 6")
    return text.strip()

def correct_text(text):
    """Apply NLP-based spell correction"""
    corrected = TextBlob(text).correct()
    return "".join([char for char in str(corrected) if char.isalpha() or char.isspace()])

def save_text_to_doc(text):
    """Save extracted text to a Word document"""
    doc_path = os.path.join(OUTPUT_FOLDER, "extracted_text.docx")
    doc = Document()
    doc.add_paragraph(text)
    doc.save(doc_path)
    return doc_path

@app.route("/upload", methods=["POST"])
def upload_file():
    """Handle image upload and extract text"""
    data = request.json
    image_data = data.get("image")
    
    if not image_data:
        return jsonify({"error": "No image data received"}), 400
    
    # Decode base64 image
    image_bytes = base64.b64decode(image_data.split(",")[1])
    image_path = os.path.join(UPLOAD_FOLDER, "uploaded.png")
    
    # Save image
    with open(image_path, "wb") as f:
        f.write(image_bytes)
    
    # Preprocess image
    processed_image_path = preprocess_image(image_path)
    
    # Extract text
    extracted_text = extract_text(processed_image_path)
    
    # Apply NLP correction
    cleaned_text = correct_text(extracted_text)
    
    # Save to Word document
    doc_path = save_text_to_doc(cleaned_text)
    
    return jsonify({"text": cleaned_text, "doc_path": doc_path}), 200

@app.route("/download", methods=["GET"])
def download_file():
    """Allow users to download the extracted Word document"""
    doc_path = os.path.join(OUTPUT_FOLDER, "extracted_text.docx")
    if os.path.exists(doc_path):
        return send_file(doc_path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)