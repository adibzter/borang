import { useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { addSubscription } from '../utils/firebase';
import { useUserStore } from '../stores/userStore';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = useState(false);

  const [userEmail] = useUserStore((state) => [state.userEmail]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleGoPremium = async () => {
    // await addSubscription(userEmail);
    // setOpen(false);
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
        Premium
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>Get Premium Borang</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <h3>You will get:</h3>
            <ul>
              <li>Unlimited form submission</li>
            </ul>
            <hr />
            <h3>Soon...</h3>
            <ul>
              <li>Support for mobile</li>
              <li>Support for form that require sign-in</li>
              <li>And more...</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            startIcon={
              <FontAwesomeIcon
                icon={faMedal}
                fade
                style={{ animationDuration: '2s' }}
              />
            }
            onClick={handleGoPremium}
            disabled
          >
            Go Premium
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
