# model.py

import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import numpy as np
import cv2

# Load processor and model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def segment_lines(image: Image.Image):
    """
    Segments lines from a cleaned PIL image using horizontal projection.
    """
    gray = np.array(image.convert("L"))
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    horizontal_proj = np.sum(binary, axis=1)
    lines = []
    start = None

    for i, val in enumerate(horizontal_proj):
        if val > 0 and start is None:
            start = i
        elif val == 0 and start is not None:
            if i - start > 10:
                lines.append((start, i))
            start = None

    if start is not None and len(binary) - start > 10:
        lines.append((start, len(binary)))

    return [image.crop((0, top, image.width, bottom)) for top, bottom in lines]

def predict_text(image: Image.Image):
    """
    Predicts text from a PIL image using TrOCR after segmenting lines.
    """
    lines = segment_lines(image)
    results = []

    for line_img in lines:
        try:
            pixel_values = processor(images=line_img.convert("RGB"), return_tensors="pt").pixel_values.to(device)
            generated_ids = model.generate(pixel_values)
            prediction = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            results.append(prediction.strip())
        except Exception:
            results.append("[Error: Could not recognize line]")

    return "\n".join(results)
