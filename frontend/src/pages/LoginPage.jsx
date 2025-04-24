import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Fade, Zoom } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      login(response.data);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        setError('No response from server. Please check if the backend server is running.');
      } else {
        setError('Error setting up the request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        p: 2
      }}
    >
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 4,
            borderRadius: 2,
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
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
                mb: 3
              }}
            >
              Welcome Back
            </Typography>
          </motion.div>

          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                  boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  color: '#666',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#1a237e',
                  }
                }}
                onClick={() => navigate('/signup')}
              >
                Don't have an account? Sign up
              </Typography>
            </motion.div>
          </form>
        </Paper>
      </Zoom>
    </Box>
  );
};

export default LoginPage;