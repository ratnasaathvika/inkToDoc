# utils.py

import cv2
import numpy as np
from PIL import Image

def preprocess_image(image):
    """
    Converts the image to grayscale and resizes it if too wide.
    """
    gray = np.array(image.convert("L"))
    h, w = gray.shape
    if w > 1280:
        gray = cv2.resize(gray, (1280, int(h * 1280 / w)))
    return Image.fromarray(gray)
