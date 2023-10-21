import { Box, Toolbar } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const Qr = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Toolbar />
      <Box
        component='main'
        display='flex'
        minHeight='90vh'
        alignItems='center'
        flexDirection='column'
      >
        <h1>Donation with Duitnow QR</h1>
        <img
          src='https://storage.googleapis.com/sejarah-bot/duitnow.png'
          alt='duitnow-qr'
          style={{ border: '1px dashed black' }}
        />
      </Box>
    </>
  );
};

export default Qr;
