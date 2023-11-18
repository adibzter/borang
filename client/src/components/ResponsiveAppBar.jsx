import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, IconButton, Tooltip } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faStripe } from '@fortawesome/free-brands-svg-icons';
import { getCurrentUser, signIn, signOut } from '../utils/firebase';
import { useUserStore } from '../stores/userStore';
import LogoAppBar from './LogoAppBar';
import { Link } from 'react-router-dom';
import BadgesPopover from './BadgesPopover';
import SwipeableTemporaryDrawer from './SwipeableTemporaryDrawer';
import { getUser } from '../utils/api';

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
    badges,
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
    state.badges,
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
          }
        } catch (error) {
          console.error(error);
        }
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

          {isPremium && (
            <Box sx={{ flexGrow: 0, marginRight: 2 }}>
              <Tooltip title='Manage Subscription'>
                <IconButton color='primary'>
                  <FontAwesomeIcon
                    onClick={() =>
                      openNewTab(
                        `https://billing.stripe.com/p/login/4gwaFudEs44lgpO000?prefilled_email=${userEmail}`
                      )
                    }
                    icon={faStripe}
                  />
                </IconButton>
              </Tooltip>
              {/* <BadgesPopover /> */}
            </Box>
          )}

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
    </AppBar>
  );
}
export default ResponsiveAppBar;
