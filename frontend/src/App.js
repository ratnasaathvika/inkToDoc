import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import AuthButtons from './components/AuthButtons';
import UserProfileMenu from './components/UserProfileMenu';
import UploadPage from './pages/UploadPage';
import ExtractedTextPage from './pages/ExtractedTextPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { UserProvider, useUser } from './context/UserContext';
import { ProcessingProvider } from './context/ProcessingContext';
import './index.css';

const AppContent = () => {
  const { isAuthenticated } = useUser();

  return (
    <Router>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header>
          {isAuthenticated() ? <UserProfileMenu /> : <AuthButtons />}
        </Header>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/extracted" element={<ExtractedTextPage />} />
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
      <ProcessingProvider>
        <AppContent />
      </ProcessingProvider>
    </UserProvider>
  );
};

export default App;