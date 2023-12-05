import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Avatar, Tooltip } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { getCurrentUser, signIn, signOut } from '../utils/firebase';
import { useUserStore } from '../stores/userStore';
import LogoAppBar from './LogoAppBar';
import { Link } from 'react-router-dom';
import SettingsPopover from './SettingsPopover';
import SwipeableTemporaryDrawer from './SwipeableTemporaryDrawer';
import { getUser } from '../utils/api';
import { purple } from '@mui/material/colors';

const pages = [
  {
    id: 'products',
    display: 'Products',
  },
  {
    id: 'pricing',
    display: 'Pricing',
  },
  {
    id: 'about',
    display: 'About',
  },
  {
    id: 'privacy',
    display: 'Privacy Policy',
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  const [
    setIsReady,
    userEmail,
    userPhotoUrl,
    userDisplayName,
    isSignInLoading,
    setUserEmail,
    setUserDisplayName,
    setUserPhotoUrl,
    setIsSignInLoading,
    setBadges,
  ] = useUserStore((state) => [
    state.setIsReady,
    state.userEmail,
    state.userPhotoUrl,
    state.userDisplayName,
    state.isSignInLoading,
    state.setUserEmail,
    state.setUserDisplayName,
    state.setUserPhotoUrl,
    state.setIsSignInLoading,
    state.setBadges,
  ]);

  useEffect(() => {
    (async () => {
      setIsReady(false);
      const user = await getCurrentUser();
      setIsReady(true);

      if (user) {
        setUserEmail(user.email);
        setUserDisplayName(user.displayName);
        setUserPhotoUrl(user.photoURL);

        try {
          const userData = await getUser(user.email);
          setBadges(!userData ? [] : userData.badges);

          if (userData?.badges?.includes('skrin-premium')) {
            setIsPremium(true);
          } else {
            injectAds();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        injectAds();
      }
    })();
  }, [isSignInLoading]);

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSignIn = async () => {
    setIsSignInLoading(true);
    await signIn();

    setIsSignInLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();

    setUserEmail(null);
    setUserDisplayName(null);
    setUserPhotoUrl(null);
    setBadges(null);
    setIsPremium(false);
  };

  const injectAds = () => {
    const borangAds = document.querySelector('#borang-ads');
    if (borangAds) {
      return;
    }

    const adsScript = document.createElement('script');

    adsScript.id = 'borang-ads';
    adsScript.setAttribute(
      'src',
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3634416280129603'
    );
    adsScript.setAttribute('async', '');
    adsScript.setAttribute('crossorigin', 'anonymous');

    document.head.appendChild(adsScript);
  };

  return (
    <AppBar
      position='fixed'
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        boxShadow: 'none',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <LogoAppBar display={{ xs: 'none', md: 'flex' }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <SwipeableTemporaryDrawer />
          </Box>
          <LogoAppBar display={{ xs: 'flex', md: 'none' }} />
          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          ></Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link
                key={page.id}
                to={`/${page.id}`}
                style={{ textDecoration: 'none' }}
              >
                {`/${page.id}` === window.location.pathname ? (
                  <Button
                    variant='outlined'
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'black', display: 'block' }}
                  >
                    {page.display}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'black', display: 'block' }}
                  >
                    {page.display}
                  </Button>
                )}
              </Link>
            ))}
          </Box>

          {isPremium && <SettingsPopover />}

          <Box sx={{ flexGrow: 0 }}>
            {!userEmail ? (
              <LoadingButton
                variant='outlined'
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                loading={isSignInLoading}
                onClick={handleSignIn}
              >
                Sign in
              </LoadingButton>
            ) : (
              <Tooltip title={`Sign out from ${userDisplayName}`}>
                <LoadingButton
                  variant='outlined'
                  color='error'
                  startIcon={
                    <Avatar
                      alt='User Photo'
                      src={userPhotoUrl}
                      sx={{ width: 24, height: 24 }}
                    />
                  }
                  loading={isSignInLoading}
                  onClick={handleSignOut}
                >
                  Sign Out
                </LoadingButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Alert severity='info'>
        <b>BETA</b>: <span style={{ color: purple[400] }}>Skrin Premium</span>{' '}
        users now can submit form using mobile device! Go to{' '}
        <a href='/mobile'>mobile page</a> to test it out!
      </Alert>
    </AppBar>
  );
}
export default ResponsiveAppBar;
