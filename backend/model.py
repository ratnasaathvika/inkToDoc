# model.py

import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import cv2
import numpy as np

# Load the processor and model once
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def segment_lines(image: Image.Image):
    """
    Takes a PIL Image and returns a list of line-segmented PIL Images.
    """
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    horizontal_proj = np.sum(binary, axis=1)
    lines = []
    start = None
    for i, value in enumerate(horizontal_proj):
        if value > 0 and start is None:
            start = i
        elif value == 0 and start is not None:
            if i - start > 10:  # Ignore very small lines
                lines.append((start, i))
            start = None
    if start is not None and len(binary) - start > 10:
        lines.append((start, len(binary)))

    line_images = [image.crop((0, top, image.width, bottom)) for top, bottom in lines]
    return line_images

def predict_text(image: Image.Image):
    """
    Predicts text from the given PIL image using TrOCR.
    Performs line segmentation and processes each line individually.
    """
    lines = segment_lines(image)
    results = []

    for line_img in lines:
        pixel_values = processor(images=line_img, return_tensors="pt").pixel_values.to(device)
        generated_ids = model.generate(pixel_values)
        prediction = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        results.append(prediction.strip())

    return "\n".join(results)
