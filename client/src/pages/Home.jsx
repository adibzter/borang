import { Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChrome, faGithub } from '@fortawesome/free-brands-svg-icons';

import ResponsiveAppBar from '../components/ResponsiveAppBar';
import SubscriptionDialog from '../components/SubscriptionDialog';
import { getTokenId } from '../utils/firebase';

const Home = () => {
  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  async function handleLog() {
    const tokenId = await getTokenId();
    const response = await fetch('/api/subscriptions', {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
    });

    alert(await response.text());
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        minHeight='90vh'
      >
        {/* <button onClick={handleLog}>sfdsfd</button> */}
        <h2>Borang Chrome Extension</h2>
        <iframe
          width='560'
          height='315'
          src='https://www.youtube.com/embed/W1pJxIIzZ_A?si=IYJ-jLQl-rCV_qkQ'
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;'
          allowfullscreen
        ></iframe>

        <Box
          marginY={4}
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
        >
          <Box display='flex'>
            <Button
              style={{ marginRight: 2 }}
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faChrome} />}
              onClick={() =>
                openNewTab(
                  'https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol'
                )
              }
            >
              Install Borang
            </Button>
            <SubscriptionDialog />
          </Box>

          <h3>GitHub</h3>
          <Box display='flex'>
            <Button
              style={{ marginRight: 2 }}
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faGithub} />}
              onClick={() => openNewTab('https://github.com/adibzter/borang')}
            >
              Web App
            </Button>
            <Button
              style={{ marginLeft: 2 }}
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faGithub} />}
              onClick={() =>
                openNewTab(
                  'https://github.com/adibzter/borang-chrome-extension'
                )
              }
            >
              Chrome Extension
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
