# InkToDoc - Handwritten Text Recognition

A full-stack application that converts handwritten text from images into digital text using OCR technology.

## Features

- Upload handwritten text images
- Extract text using TrOCR model
- User authentication
- Save and manage extracted text
- Modern UI with Material-UI

## Tech Stack

### Backend
- Python Flask
- PyTorch & Transformers (TrOCR)
- OpenCV for image processing
- MongoDB for database

### Frontend
- React.js
- Material-UI
- Framer Motion for animations
- Axios for API calls

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB 4.0+
- npm 6+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ratnasaathvika/inkToDoc.git
cd inkToDoc
```

2. Backend Setup:
```bash
# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
cd backend
pip install -r requirements.txt
```

3. Frontend Setup:
```bash
cd frontend
npm install
```

4. Environment Setup:
Create `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
inkToDoc/
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── requirements.txt
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── uploads/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 