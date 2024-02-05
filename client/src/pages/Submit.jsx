import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChrome,
  faGithub,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons';
import { faCircleCheck, faMedal } from '@fortawesome/free-solid-svg-icons';

import ResponsiveAppBar from '../components/ResponsiveAppBar';
import SubscriptionDialog from '../components/SubscriptionDialog';
import TemplateDialog from '../components/TemplateDialog';
import { purple } from '@mui/material/colors';
import { deleteFormData, getFormData, getUser } from '../utils/api';
import { useUserStore } from '../stores/userStore';
import { submitFormFree, submitFormPremium } from '../utils/googleForm';

const Submit = () => {
  const [limit, setLimit] = useState(0);
  const [counter, setCounter] = useState(1);
  const [request, setRequest] = useState(0);
  const [isPremium, setIsPremium] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isReady, userEmail, setBadges] = useUserStore((state) => [
    state.isReady,
    state.userEmail,
    state.setBadges,
  ]);

  const urls = {
    stripe: 'https://donate.stripe.com/7sI5kZ22L78C8xy28c',
    duitnow: 'https://storage.googleapis.com/sejarah-bot/duitnow.png',
    subscribeYoutube: 'https://www.youtube.com/c/kiraa?sub_confirmation=1',
    extensionChromeStore:
      'https://chrome.google.com/webstore/detail/borang/mokcmggiibmlpblkcdnblmajnplennol',
    serverRepo: 'https://github.com/ADIBzTER/borang',
    extensionRepo: 'https://github.com/ADIBzTER/borang-chrome-extension',
    discord: 'https://discord.gg/rGkPJju9zD',
  };

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    document.title = 'Borang | Submit';

    setTimeout(() => {
      setIsDialogOpen(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    (async () => {
      const formId = window.location.search.split('=')[1];
      const res = await getFormData(formId);
      if (!res) {
        return;
      }

      let speed = 50;
      let { limit, counter, formUrl, body } = res;

      let userData = { badges: [] };

      // Signed in users
      try {
        userData = await getUser(userEmail);
        if (!userData) {
          userData = { badges: [] };
        }

        setBadges(userData.badges);
        speed = userData.settings.speed;
      } catch (error) {
        console.error(error);
      }

      // Limit non-premium users
      if (!userData.badges.includes('skrin-premium')) {
        setIsPremium(false);
        window._isPremium = false;
        counter = counter > limit ? limit : counter;
        deleteFormData(formId);
      } else {
        setIsPremium(true);
        window._isPremium = true;
      }

      setLimit(limit);
      setCounter(counter);
      spamForm(counter, formUrl, body, speed);
    })();
  }, [isReady]);

  const spamForm = async (counter, formUrl, body, speed) => {
    if (window._isPremium) {
      for (let i = 0; i < counter; i++) {
        try {
          await submitFormPremium(formUrl, body, speed);
        } catch (error) {
          console.error(error);
        } finally {
          setRequest((prev) => prev + 1);
        }
      }
    } else {
      for (let i = 0; i < counter; i++) {
        try {
          await submitFormFree(formUrl, body);
        } catch (error) {
          console.error(error);
        } finally {
          setRequest((prev) => prev + 1);
        }
      }
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
        alignItems='center'
        minHeight='90vh'
      >
        {!isReady ? (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <h1>Submit</h1>
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
            {isPremium == true && (
              <>
                <p>
                  <span style={{ color: purple[400] }}>Skrin Premium</span>
                </p>
                <IconButton color='secondary'>
                  <FontAwesomeIcon
                    icon={faMedal}
                    fade
                    style={{ animationDuration: '2s' }}
                  />
                </IconButton>
              </>
            )}

            {isPremium == false && (
              <p style={{ textAlign: 'center' }}>
                Free version has speed limit and can submit up to <b>{limit}</b>{' '}
                submissions. Get{' '}
                <span style={{ color: purple[400] }}>Skrin Premium</span> for
                unlimited and fast submission
              </p>
            )}
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
                <Button
                  style={{ marginRight: 2 }}
                  variant='outlined'
                  startIcon={<FontAwesomeIcon icon={faDiscord} />}
                  onClick={() => openNewTab(urls.discord)}
                >
                  Join Discord
                </Button>

                {!isPremium && <SubscriptionDialog />}
              </Box>

              <h3>GitHub</h3>
              <Box display='flex'>
                <Button
                  style={{ marginRight: 2 }}
                  variant='outlined'
                  startIcon={<FontAwesomeIcon icon={faGithub} />}
                  onClick={() =>
                    openNewTab('https://github.com/adibzter/borang')
                  }
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
            <iframe
              width='560'
              height='315'
              src='https://www.youtube.com/embed/-VYedOAtd5I?si=UUfTD7tI7OrjGJCT'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;'
              allowfullscreen
            ></iframe>
          </Box>
        )}
      </Box>
      <TemplateDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ padding: 3 }}>
            You can spam using <b>mobile device</b> now! Subscribe to{' '}
            <span style={{ color: purple[400] }}>Skrin Premium</span> for more
            features
          </p>
          <iframe
            width='315'
            height='560'
            src='https://www.youtube.com/embed/7OguBowi9pA?si=cBsV-qU40qOzwKYN'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowfullscreen
          ></iframe>
        </div>
      </TemplateDialog>
    </>
  );
};

export default Submit;
