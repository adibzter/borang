import { useEffect } from 'react';
import { Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const Subscribed = () => {
  useEffect(() => {
    document.title = 'Borang | Subscribed';

    setTimeout(() => {
      location.href = '/';
    }, 10000);
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Box
        component='main'
        alignItems='center'
        justifyContent='center'
        display='flex'
        minHeight='90vh'
        flexDirection='column'
      >
        <h1>💗Thanks For the The Subscription💗</h1>
        <h2>We appreciate very much your contribution to this project</h2>
        <h3>Make sure you are logged in using the correct account</h3>
        <p>Redirecting...</p>
      </Box>
    </>
  );
};

export default Subscribed;
