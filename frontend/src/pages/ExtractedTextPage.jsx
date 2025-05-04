import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Select, 
  FormControl, 
  InputLabel, 
  MenuItem as MuiMenuItem,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon, 
  ContentCopy as ContentCopyIcon, 
  Check as CheckIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

const ExtractedTextPage = ({ extractedText, setExtractedText }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState('docx');
  const [displayMode, setDisplayMode] = useState('edit');
  const [fontSize, setFontSize] = useState('medium');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (extractedText) {
        localStorage.setItem('autoSavedText', extractedText);
        setAutoSaveStatus('saved');
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [extractedText]);

  // Load auto-saved text on component mount
  useEffect(() => {
    const savedText = localStorage.getItem('autoSavedText');
    if (savedText && !extractedText) {
      setExtractedText(savedText);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setSnackbarMessage('Text copied to clipboard!');
    setShowSnackbar(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      const doc = new jsPDF();
      doc.setFont("helvetica");
      doc.setFontSize(12);
      
      // Apply formatting to PDF
      if (formatting.bold) {
        doc.setFont("helvetica", "bold");
      }
      if (formatting.italic) {
        doc.setFont("helvetica", "italic");
      }
      
      const splitText = doc.splitTextToSize(extractedText, 180);
      doc.text(splitText, 15, 15);
      
      // Add underline if needed
      if (formatting.underline) {
        const textWidth = doc.getTextWidth(extractedText);
        doc.line(15, 20, 15 + textWidth, 20);
      }
      
      doc.save('extracted-notes.pdf');
    } else if (exportFormat === 'docx') {
      // Create a formatted HTML content
      const formattedContent = `
        <html>
          <head>
            <style>
              body {
                font-size: ${getFontSize(fontSize)};
                font-weight: ${formatting.bold ? 'bold' : 'normal'};
                font-style: ${formatting.italic ? 'italic' : 'normal'};
                text-decoration: ${formatting.underline ? 'underline' : 'none'};
              }
            </style>
          </head>
          <body>
            ${extractedText}
          </body>
        </html>
      `;
      
      const element = document.createElement("a");
      const file = new Blob([formattedContent], { type: 'application/msword' });
      element.href = URL.createObjectURL(file);
      element.download = 'extracted-notes.docx';
      document.body.appendChild(element);
      element.click();
    } else {
      // For txt format, we'll include formatting markers
      let formattedText = extractedText;
      if (formatting.bold) formattedText = `**${formattedText}**`;
      if (formatting.italic) formattedText = `*${formattedText}*`;
      if (formatting.underline) formattedText = `_${formattedText}_`;
      
      const element = document.createElement("a");
      const file = new Blob([formattedText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `extracted-notes.${exportFormat}`;
      document.body.appendChild(element);
      element.click();
    }
    setSnackbarMessage(`Text exported as ${exportFormat.toUpperCase()}!`);
    setShowSnackbar(true);
  };

  const getFontSize = (size) => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      default: return '1rem';
    }
  };

  const handleFormatChange = (format) => {
    setFormatting(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const wordCount = extractedText.trim() === '' ? 0 : extractedText.trim().split(/\s+/).length;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              pb: 6
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Extracted Text
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <ToggleButtonGroup
                  value={displayMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setDisplayMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="edit">
                    <Tooltip title="Edit Mode">
                      <VisibilityIcon />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="preview">
                    <Tooltip title="Preview Mode">
                      <VisibilityOffIcon />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {displayMode === 'edit' ? (
                <>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <ToggleButtonGroup
                      value={fontSize}
                      exclusive
                      onChange={(e, newSize) => newSize && setFontSize(newSize)}
                      size="small"
                    >
                      <ToggleButton value="small">A</ToggleButton>
                      <ToggleButton value="medium">A</ToggleButton>
                      <ToggleButton value="large">A</ToggleButton>
                    </ToggleButtonGroup>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <ToggleButton
                      value="bold"
                      selected={formatting.bold}
                      onChange={() => handleFormatChange('bold')}
                      size="small"
                    >
                      <Tooltip title="Bold">
                        <FormatBoldIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                      value="italic"
                      selected={formatting.italic}
                      onChange={() => handleFormatChange('italic')}
                      size="small"
                    >
                      <Tooltip title="Italic">
                        <FormatItalicIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                      value="underline"
                      selected={formatting.underline}
                      onChange={() => handleFormatChange('underline')}
                      size="small"
                    >
                      <Tooltip title="Underline">
                        <FormatUnderlinedIcon />
                      </Tooltip>
                    </ToggleButton>
                  </Box>
                  <TextField
                    multiline
                    fullWidth
                    minRows={10}
                    maxRows={20}
                    value={extractedText}
                    onChange={(e) => {
                      setExtractedText(e.target.value);
                      setAutoSaveStatus('saving...');
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: getFontSize(fontSize),
                        '&:hover fieldset': {
                          borderColor: '#1a237e',
                        },
                        '& textarea': {
                          fontWeight: formatting.bold ? 'bold' : 'normal',
                          fontStyle: formatting.italic ? 'italic' : 'normal',
                          textDecoration: formatting.underline ? 'underline' : 'none',
                        }
                      },
                    }}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    minHeight: '300px',
                    fontSize: getFontSize(fontSize),
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    fontWeight: formatting.bold ? 'bold' : 'normal',
                    fontStyle: formatting.italic ? 'italic' : 'normal',
                    textDecoration: formatting.underline ? 'underline' : 'none',
                  }}
                >
                  {extractedText}
                </Box>
              )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  {wordCount} words | {extractedText.length} characters
                </Typography>
                {autoSaveStatus === 'saving...' && (
                  <Typography variant="body2" color="textSecondary">
                    Saving...
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
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
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                  boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                  }
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExtractedTextPage;