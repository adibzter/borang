import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

const Subscribed = () => {
  useEffect(() => {
    document.title = 'Borang | Subscribed';
  }, []);

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
        <h1>🌟Thanks For the The Subscription🌟</h1>
        <h3>Make sure you are logged in using the correct account</h3>
        <h4>Join discord server to get more news for upcoming updates!</h4>
        <Button
          style={{ marginRight: 2 }}
          variant='outlined'
          startIcon={<FontAwesomeIcon icon={faDiscord} />}
          onClick={() => openNewTab('https://discord.gg/rGkPJju9zD')}
        >
          Join Discord
        </Button>
      </Box>
    </>
  );
};

export default Subscribed;
