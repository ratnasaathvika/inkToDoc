import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Backdrop, CircularProgress, Box } from '@mui/material';
import Header from './components/Header';
import AuthButtons from './components/AuthButtons';
import UserProfileMenu from './components/UserProfileMenu';
import UploadPage from './pages/UploadPage';
import ExtractedTextPage from './pages/ExtractedTextPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { UserProvider, useUser } from './context/UserContext';
import './index.css';

const AppContent = () => {
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const { isAuthenticated } = useUser();

  return (
    <Router>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header>
          {isAuthenticated() ? <UserProfileMenu /> : <AuthButtons />}
        </Header>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={processing}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Routes>
            <Route path="/" element={<UploadPage setProcessing={setProcessing} setExtractedText={setExtractedText} isAuthenticated={isAuthenticated} />} />
            <Route path="/extracted" element={<ExtractedTextPage extractedText={extractedText} setExtractedText={setExtractedText} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;