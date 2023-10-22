import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChrome, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import ResponsiveAppBar from '../components/ResponsiveAppBar';
import SubscriptionDialog from '../components/SubscriptionDialog';
import { purple } from '@mui/material/colors';

const Submit = () => {
  const [limit, setLimit] = useState(0);
  const [counter, setCounter] = useState(1);
  const [request, setRequest] = useState(0);

  const urls = {
    stripe: 'https://donate.stripe.com/7sI5kZ22L78C8xy28c',
    duitnow: 'https://storage.googleapis.com/sejarah-bot/duitnow.png',
    subscribeYoutube: 'https://www.youtube.com/c/kiraa?sub_confirmation=1',
    extensionChromeStore:
      'https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol',
    serverRepo: 'https://github.com/ADIBzTER/borang',
    extensionRepo: 'https://github.com/ADIBzTER/borang-chrome-extension',
  };

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    (async () => {
      const formId = window.location.search.split('=')[1];
      const res = await fetch(`/api/form/${formId}`);
      const { limit, counter, formUrl, body } = await res.json();
      spamForm(counter, formUrl, body);

      setLimit(limit);
      setCounter(counter);
    })();
  }, []);

  // Wait util
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const spamForm = async (counter, formUrl, body) => {
    for (let i = 0; i < counter; i++) {
      await wait(10);

      fetch(formUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      setRequest((prev) => prev + 1);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Toolbar />
      <Box
        component='main'
        display='flex'
        justifyContent='center'
        minHeight='90vh'
      >
        <Box display='flex' flexDirection='column' alignItems='center'>
          <h1 style={{ textAlign: 'center' }}>Submit</h1>
          <h3>
            Can you do me a favour by subscribing my{' '}
            <a href={urls.subscribeYoutube} target='_blank' rel='noreferrer'>
              YouTube channel
            </a>
            ?
          </h3>
          {request !== counter ? (
            <CircularProgress
              variant='determinate'
              value={((request / counter) * 100).toFixed()}
            />
          ) : (
            <IconButton color='primary'>
              <FontAwesomeIcon icon={faCircleCheck} />
            </IconButton>
          )}
          <b>
            {request} / {counter}
          </b>
          <br />
          <p>
            We are limiting response to <b>{limit}</b>. If you want to submit
            unlimited submissions, get{' '}
            <span style={{ color: purple[400] }}>Skrin Premium</span>
          </p>
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
                onClick={() => openNewTab(urls.extensionChromeStore)}
              >
                Rate Borang
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
      </Box>
    </>
  );
};

export default Submit;
