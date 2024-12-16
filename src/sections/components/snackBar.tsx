import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarComponentProps {
  open: boolean;
  message: string;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  status: 'success' | 'error' | 'info' | 'warning';
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, message, onClose,status }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={status}
        sx={{ width: '100%', fontSize: '1rem', padding: '16px', marginTop: '30px' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;