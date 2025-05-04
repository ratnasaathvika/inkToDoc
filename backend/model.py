# model.py

import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import numpy as np
import cv2

# Load processor and model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def preprocess_image(image):
    """
    Preprocesses the image to improve text extraction using OpenCV.
    """
    # Convert to grayscale if image is in color
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    # Resize image if too large
    max_height = 1280
    if gray.shape[0] > max_height:
        scale = max_height / gray.shape[0]
        gray = cv2.resize(gray, None, fx=scale, fy=scale)
    
    # Apply adaptive thresholding for better text/background separation
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Remove small noise
    kernel = np.ones((2, 2), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    
    return binary

def segment_lines(image):
    """
    Segments lines from an image using horizontal projection.
    """
    # Preprocess the image
    binary = preprocess_image(image)
    
    # Calculate horizontal projection
    horizontal_proj = np.sum(binary, axis=1)
    
    # Find line boundaries
    lines = []
    start = None
    threshold = np.mean(horizontal_proj) * 0.5
    min_line_height = 10
    
    for i, val in enumerate(horizontal_proj):
        if val > threshold and start is None:
            start = i
        elif val <= threshold and start is not None:
            if i - start > min_line_height:
                lines.append((start, i))
            start = None
    
    if start is not None and len(binary) - start > min_line_height:
        lines.append((start, len(binary)))
    
    # If no lines detected, return the whole image as one line
    if not lines:
        return [image]
    
    return [(image[top:bottom, :]) for top, bottom in lines]

def predict_text(image):
    """
    Predicts text from an image using TrOCR.
    """
    try:
        lines = segment_lines(image)
        results = []
        
        for line_img in lines:
            try:
                # Ensure minimum size for the model
                min_height = 32
                if line_img.shape[0] < min_height:
                    padding = np.ones((min_height - line_img.shape[0], line_img.shape[1], 3), dtype=np.uint8) * 255
                    line_img = np.vstack([line_img, padding])
                
                # Convert to RGB for the model
                if len(line_img.shape) == 2:  # If grayscale
                    rgb_line = cv2.cvtColor(line_img, cv2.COLOR_GRAY2RGB)
                elif line_img.shape[2] == 3:  # If BGR
                    rgb_line = cv2.cvtColor(line_img, cv2.COLOR_BGR2RGB)
                else:
                    rgb_line = line_img
                
                # Process and predict
                pixel_values = processor(images=rgb_line, return_tensors="pt").pixel_values.to(device)
                generated_ids = model.generate(pixel_values)
                prediction = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                if prediction.strip():
                    results.append(prediction.strip())
                else:
                    results.append("[No text detected]")
                    
            except Exception as e:
                print(f"Error processing line: {str(e)}")
                results.append("[Error: Could not recognize line]")
        
        return "\n".join(results) if results else "[No text detected]"
        
    except Exception as e:
        print(f"Error in predict_text: {str(e)}")
        return "[Error: Could not process image]"
