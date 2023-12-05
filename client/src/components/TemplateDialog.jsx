import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function TemplateDialog({
  children,
  isDialogOpen,
  setIsDialogOpen,
}) {
  return (
    <>
      <Dialog
        open={isDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsDialogOpen(false)}
        aria-describedby='alert-dialog-slide-description'
      >
        {children}
      </Dialog>
    </>
  );
}
