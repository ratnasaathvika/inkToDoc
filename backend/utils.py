import cv2
import numpy as np
from PIL import Image

def preprocess_image(image):
    # Convert to grayscale
    gray = np.array(image.convert("L"))

    # Resize (optional for consistency)
    h, w = gray.shape
    if w > 1280:
        gray = cv2.resize(gray, (1280, int(h * 1280 / w)))

    return Image.fromarray(gray)

def segment_lines(image):
    # Convert image to grayscale
    img = np.array(image.convert("L"))
    _, thresh = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Morphological operations to detect lines
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (image.width // 2, 1))
    dilated = cv2.dilate(thresh, kernel, iterations=2)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    lines = []
    
    for cnt in sorted(contours, key=lambda c: cv2.boundingRect(c)[1]):
        x, y, w, h = cv2.boundingRect(cnt)
        if h > 10:
            line_img = img[y:y+h, x:x+w]
            lines.append(Image.fromarray(line_img))

    return lines
