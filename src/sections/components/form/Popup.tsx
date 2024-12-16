import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
  title: string;
  children: React.ReactNode;
  openPopup: boolean;
  formId?: string
  setOpenPopup: (open: boolean) => void;
};

const Popup = ({ title, children, openPopup, formId, setOpenPopup }: PopupProps) => {
  return (
    <Dialog open={openPopup} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography typography="h5">{title}</Typography>
          {setOpenPopup && <Button onClick={() => setOpenPopup(false)}><CloseIcon /></Button>}
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ 
          overflowY: 'auto',
          flexGrow: 1, // Cho phép nội dung mở rộng để lấp đầy không gian còn lại
          display: 'flex',
          flexDirection: 'column',
        }} >
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {children}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
