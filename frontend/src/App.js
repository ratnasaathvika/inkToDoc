import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  TextField,
  Backdrop,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  FileDownload as FileDownloadIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';

// ====================== COMPONENTS ======================

const UserProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar sx={{ bgcolor: '#3f51b5' }}>
          <AccountCircleIcon />
        </Avatar>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <MenuItem onClick={handleClose}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ratna Saathvika</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">saathvika@example.com</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

const Header = () => (
  <AppBar position="static">
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Typography variant="h6" component="div">
        Handwritten Notes Converter
      </Typography>
      <UserProfileMenu />
    </Toolbar>
  </AppBar>
);

const UploadPage = ({ setProcessing, setExtractedText }) => {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match('image.*') || file.name.match(/\.(jpg|jpeg|png|gif)$/))) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    console.log("Uploading:", selectedFile); // ✅ Added for debugging

    setProcessing(true);
    const formData = new FormData();
    formData.append('image', selectedFile); // ✅ Should match backend 'image'

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedText(response.data.extracted_text);
      setProcessing(false);
      navigate('/extracted');
    } catch (error) {
      console.error('Error processing document:', error);
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Upload Your Handwritten Notes
      </Typography>

      <input
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleFileChange}
      />

      <Box sx={{
        width: '100%',
        border: '2px dashed #aaa',
        borderRadius: 2,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '16px' }}
          />
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 60, color: '#aaa' }} />
            <Typography variant="body1" color="textSecondary">
              Drag and drop your image here or click to browse
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          component="span"
          startIcon={<ImageIcon />}
          onClick={() => fileInputRef.current.click()}
        >
          Select Image
        </Button>
      </Box>

      {selectedFile && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CloudUploadIcon />}
          onClick={handleExtract}
          sx={{ mt: 2 }}
        >
          Extract Text
        </Button>
      )}
    </Box>
  );
};

const ExtractedTextPage = ({ extractedText, setExtractedText }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState('docx');
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    alert(`Exporting as ${exportFormat.toUpperCase()} file...`);
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted-notes.${exportFormat}`;

    document.body.appendChild(element);
    element.click();
  };

  const wordCount = extractedText.trim() === '' ? 0 : extractedText.trim().split(/\s+/).length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" gutterBottom>
        Extracted Text
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={10}
        value={extractedText}
        onChange={(e) => setExtractedText(e.target.value)}
        variant="outlined"
        sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '1rem' } }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {wordCount} words | {extractedText.length} characters
        </Typography>

        <Button
          variant="outlined"
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          onClick={handleCopy}
          sx={{ mr: 2 }}
        >
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
        <FormControl>
          <InputLabel>Export As</InputLabel>
          <Select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            label="Export As"
            sx={{ minWidth: 120 }}
          >
            <MuiMenuItem value="txt">TXT</MuiMenuItem>
            <MuiMenuItem value="docx">DOCX</MuiMenuItem>
            <MuiMenuItem value="pdf">PDF</MuiMenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

const App = () => {
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  return (
    <Router>
      <Header />
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={processing}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Routes>
        <Route path="/" element={<UploadPage setProcessing={setProcessing} setExtractedText={setExtractedText} />} />
        <Route path="/extracted" element={<ExtractedTextPage extractedText={extractedText} setExtractedText={setExtractedText} />} />
      </Routes>
    </Router>
  );
};

export default App;
