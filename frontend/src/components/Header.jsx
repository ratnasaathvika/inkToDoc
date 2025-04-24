import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = ({ children }) => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static"
      sx={{
        background: '#1976d2',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderBottom: 'none'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h6" 
            component="div"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 'bold',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': {
                color: '#e3f2fd'
              }
            }}
          >
            Ink to Doc
          </Typography>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;