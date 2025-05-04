# InkToDoc - Hardware and Software Requirements

## Hardware Requirements

### Minimum Requirements
- Processor: Intel Core i3 or equivalent AMD processor
- RAM: 4GB minimum
- Storage: 500MB free disk space
- Display: 1280x720 minimum resolution
- Camera/Scanner: Any device capable of capturing clear images (for handwritten text input)

### Recommended Requirements
- Processor: Intel Core i5 or equivalent AMD processor
- RAM: 8GB or higher
- Storage: 1GB free disk space
- Display: 1920x1080 or higher resolution
- Camera/Scanner: High-resolution camera or scanner for better text recognition

## Software Requirements

### Operating System
- Windows 10/11
- macOS 10.15 or later
- Linux (Ubuntu 20.04 LTS or later)

### Backend Requirements
- Python 3.8 or higher
- Flask 2.0.0 or higher
- Required Python packages:
  - transformers
  - torch
  - numpy
  - Pillow
  - pyspellchecker
  - python-dotenv
  - flask-cors

### Frontend Requirements
- Node.js 14.0 or higher
- npm 6.0 or higher
- Required npm packages:
  - react
  - react-dom
  - @mui/material
  - @emotion/react
  - @emotion/styled
  - axios
  - react-router-dom

### Development Tools
- Git for version control
- Code editor (VS Code recommended)
- Web browser (Chrome, Firefox, or Edge latest version)

### Additional Requirements
- Internet connection for initial model download
- Microsoft TrOCR model files (automatically downloaded on first run)
- Sufficient disk space for model storage (~500MB)

## Installation Notes
1. Ensure Python and Node.js are properly installed and added to system PATH
2. Install required Python packages using pip:
   ```bash
   pip install -r requirements.txt
   ```
3. Install required npm packages:
   ```bash
   npm install
   ```
4. Set up environment variables in `.env` file
5. Ensure proper permissions for file system access

## Performance Considerations
- Text recognition speed may vary based on hardware specifications
- Processing large images may require more RAM
- GPU acceleration is optional but recommended for faster processing
- Browser should have JavaScript enabled
- Modern web browser with good performance is recommended

## Security Requirements
- Secure file handling
- Input validation
- Proper error handling
- Environment variable protection
- CORS configuration for API security

## Network Requirements
- Local network access for development
- Port 5000 available for backend server
- Port 3000 available for frontend development server
- Internet access for initial setup and model downloads 