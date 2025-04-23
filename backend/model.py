import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import numpy as np
import cv2
import os

# Load TrOCR
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def segment_lines(image):
    # Convert to grayscale numpy array for processing
    img = np.array(image.convert("L"))
    
    # Thresholding to find text lines
    _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Calculate horizontal projection
    horizontal_proj = np.sum(binary, axis=1)
    lines = []
    start = None

    # Find line start and end positions
    for i, value in enumerate(horizontal_proj):
        if value > 0 and start is None:
            start = i
        elif value == 0 and start is not None:
            if i - start > 10:  # Minimum line height threshold
                lines.append((start, i))
            start = None
    
    # Add the last line if it exists
    if start is not None and len(binary) - start > 10:
        lines.append((start, len(binary)))

    # Create debug directory if needed
    os.makedirs("debug_lines", exist_ok=True)
    line_images = []

    # Crop and save each line
    for idx, (top, bottom) in enumerate(lines):
        line = image.crop((0, top, image.width, bottom))
        line_images.append(line)
        line.save(f"debug_lines/line_{idx}.png")

    return line_images

def predict_text(image: Image.Image):
    # Work directly with the input image
    lines = segment_lines(image)
    results = []

    for line_img in lines:
        try:
            # Convert to RGB (required by TrOCR) and process
            pixel_values = processor(images=line_img.convert("RGB"), return_tensors="pt").pixel_values.to(device)
            generated_ids = model.generate(pixel_values)
            prediction = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            results.append(prediction.strip())
        except Exception as e:
            results.append("[ERROR: Failed to recognize line]")

    return "\n".join(results)