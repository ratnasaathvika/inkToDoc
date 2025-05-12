import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Zoom, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Image as ImageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useProcessing } from '../context/ProcessingContext';

const UploadPage = () => {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { setProcessing, setExtractedText, processing } = useProcessing();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleFileChange = (e) => {
    if (!isAuthenticated()) {
      setLoginDialogOpen(true);
      return;
    }
    const file = e.target.files[0];
    if (file && (file.type.match('image.*') || file.name.match(/\.(jpg|jpeg|png|gif)$/))) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectImage = () => {
    if (!isAuthenticated()) {
      setLoginDialogOpen(true);
      return;
    }
    fileInputRef.current.click();
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setExtractedText(response.data.extracted_text);
      navigate('/extracted');
    } catch (error) {
      console.error('Extraction error:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('No response from server');
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(false);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        p: 3,
        overflow: 'auto'
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#1a237e',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            mb: 4
          }}
        >
          Upload Your Handwritten Notes
        </Typography>
      </motion.div>

      <input
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
      />

      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 800,
            p: 4,
            borderRadius: 2,
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            overflow: 'auto',
            maxHeight: '90vh'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'auto'
            }}
          >
            {preview ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  overflow: 'auto'
                }}
              >
                <motion.img 
                  src={preview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '60vh',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    objectFit: 'contain'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ display: 'flex', gap: '1rem' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={processing ? <CircularProgress size={24} color="inherit" /> : <CloudUploadIcon />}
                    onClick={handleExtract}
                    disabled={processing}
                    sx={{
                      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                      boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                      },
                      minWidth: '150px'
                    }}
                  >
                    {processing ? 'Extracting...' : 'Extract Text'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<ImageIcon />}
                    onClick={handleSelectImage}
                    disabled={processing}
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      '&:hover': {
                        borderColor: '#0d47a1',
                        backgroundColor: 'rgba(26, 35, 126, 0.04)'
                      }
                    }}
                  >
                    Change Image
                  </Button>
                </motion.div>
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  minHeight: '300px',
                  maxHeight: '60vh',
                  border: '2px dashed #aaa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(5px)',
                  overflow: 'auto',
                  '&:hover': {
                    borderColor: '#1a237e',
                    backgroundColor: 'rgba(26, 35, 126, 0.04)'
                  }
                }}
                onClick={handleSelectImage}
              >
                <CloudUploadIcon sx={{ fontSize: 60, color: '#aaa' }} />
                <Typography 
                  variant="h6" 
                  color="textSecondary"
                  sx={{ 
                    textAlign: 'center',
                    maxWidth: '300px',
                    lineHeight: 1.5
                  }}
                >
                  {isAuthenticated() 
                    ? "Click here to browse and upload the image"
                    : "Please login to upload and process images"}
                </Typography>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<ImageIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                    boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                    },
                    padding: '8px 20px'
                  }}
                >
                  {isAuthenticated() ? "Select Image" : "Login to Upload"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </Paper>
      </Zoom>

      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        TransitionComponent={Zoom}
      >
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please login to upload and process images.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleLoginClick} 
            variant="contained" 
            color="primary"
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
              }
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadPage;