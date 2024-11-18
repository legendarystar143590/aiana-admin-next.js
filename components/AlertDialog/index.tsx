import * as React from 'react';
import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FaTimes } from 'react-icons/fa';

function AlertDialog({ title, description, handleAgree, handleDisagree, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);  // Use the passed setOpen to close dialog
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        PaperProps={{
            style: {
            width: '300px', // Set custom width
            height: '350px', // Set custom height
            borderRadius: '20px', // Set custom border radius
            // Or use maxWidth: '400px' for maximum width
            },
        }}
      >
        <DialogTitle 
            id="alert-dialog-title"
            sx={{ 
                backgroundColor: '#FFE5E5',
                padding: '16px'
            }}
        >
            <div className='flex justify-center items-center w-full h-[120px] relative'>
                <div className='flex h-fit items-center justify-center rounded-2xl p-1 border-white border bg-[#FFFFFF]/20 pt-2 '>
                    <Image src="/images/alert_image.png" alt="Alert icon" width={80} height={80} priority quality={75} />
                </div>
                <button 
                    type='button'
                    className='absolute top-2 right-2 border p-1 rounded-full'
                    onClick={handleClose}
                    aria-label='Close dialog'
                >
                    <FaTimes width={30} height={30} />
                </button>
            </div>
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                <div className='flex flex-col items-center justify-center pt-4 gap-2'>
                    <p className='text-lg text-black'>{title}</p>
                    <p>{description}</p>
                </div>                
            </DialogContentText>
        </DialogContent>
        <DialogActions
            sx={{
                paddingX: '16px',
                paddingBottom: '16px',
            }}
        >
            <div className='flex flex-row w-full gap-2'>
                <button type='button' onClick={handleDisagree} className='w-1/2 bg-gray-500 text-white hover:bg-gray-200 rounded-lg py-2'>No</button>
                <button type='button' onClick={handleAgree} autoFocus className='w-1/2 bg-red-500 hover:bg-gray-200 text-white rounded-lg py-2'>
                    Yes
                </button>
            </div>
        </DialogActions>
      </Dialog>
  );
}

export default AlertDialog;
