import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [docPath, setDocPath] = useState("");

    // Handle Image Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Send Image for Processing
    const handleSubmit = async () => {
        if (!image) {
            alert("Please upload an image first.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", { image });
            setText(response.data.text);
            setDocPath(response.data.doc_path);
        } catch (error) {
            console.error("Error processing image:", error);
        }
        setLoading(false);
    };

    // Download Document
    const handleDownload = () => {
        window.location.href = "http://127.0.0.1:5000/download";
    };

    return (
        <div className="app">
            <motion.h1 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="title">
                InkToDoc
            </motion.h1>

            <div className="container">
                <motion.input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="file-input"
                />

                {image && <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={image} 
                    alt="Uploaded Preview" 
                    className="preview-image" />}

                <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="process-btn">
                    {loading ? "Processing..." : "Extract Text"}
                </motion.button>

                {text && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.5 }} 
                        className="output-text">
                        <h2>Extracted Text:</h2>
                        <p>{text}</p>
                    </motion.div>
                )}

                {docPath && (
                    <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={handleDownload} 
                        className="download-btn">
                        Download Word Document
                    </motion.button>
                )}
            </div>

            <style>{`
                .app {
                    text-align: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #f6d365, #fda085);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .title {
                    font-size: 3rem;
                    font-weight: bold;
                    color: #fff;
                    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
                }
                .file-input {
                    font-size: 1rem;
                    padding: 10px;
                    border-radius: 8px;
                }
                .preview-image {
                    max-width: 300px;
                    border-radius: 15px;
                    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
                }
                .process-btn, .download-btn {
                    background: linear-gradient(90deg, #ff758c, #ff7eb3);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .process-btn:hover, .download-btn:hover {
                    background: linear-gradient(90deg, #d0537b, #d5649e);
                }
                .output-text {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                }
            `}</style>
        </div>
    );
}

export default App;
