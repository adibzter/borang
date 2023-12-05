import { useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import SkrinPremium from './SkrinPremium';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function SubscriptionDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        style={{ marginLeft: 2 }}
        variant='contained'
        color='secondary'
        startIcon={
          <FontAwesomeIcon
            icon={faMedal}
            fade
            style={{ animationDuration: '2s' }}
          />
        }
        onClick={handleClickOpen}
      >
        Skrin Premium
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby='alert-dialog-slide-description'
      >
        <SkrinPremium />
      </Dialog>
    </>
  );
}
