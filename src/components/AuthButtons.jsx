import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AuthButtons = () => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button 
      variant="contained"
      component={Link} 
      to="/login"
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
    <Button 
      variant="contained" 
      component={Link} 
      to="/signup"
      sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
        '&:hover': {
          background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        }
      }}
    >
      Sign Up
    </Button>
  </Box>
);

export default AuthButtons;
