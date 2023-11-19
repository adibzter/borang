import { useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const Privacy = () => {
  useEffect(() => {
    document.title = 'Borang | Privacy Policy';
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Toolbar />
      <Box
        component='main'
        display='flex'
        justifyContent='center'
        minHeight='90vh'
        marginTop='20px'
      >
        <Box>
          <h1 style={{ textAlign: 'center' }}>Privacy Policy</h1>
          <h2>Consent</h2>
          <ul>
            <li>
              By using our service, you hereby consent to our Privacy Policy and
              agree to its terms.
            </li>
          </ul>
          <h2>Data we collect</h2>
          <ul>
            <li>URL for your form.</li>
            <li>Number of forms you want to submit.</li>
          </ul>
          <h2>How we use your data</h2>
          <ul>
            <li>We use the URL of the form for submitting to Google.</li>
            <li>
              We never keep your data in any sort of form. We are not interested
              in it.
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default Privacy;
