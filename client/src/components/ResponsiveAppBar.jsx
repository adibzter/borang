import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Tooltip } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { getCurrentUser, signIn, signOut } from '../utils/firebase';
import { useUserStore } from '../stores/userStore';
import LogoAppBar from './LogoAppBar';
import { Link } from 'react-router-dom';
import BadgesPopover from './BadgesPopover';

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
  const [isGoogleSignInLoading, setIsSignInLoading] = useState(false);

  const [
    userEmail,
    userPhotoUrl,
    userDisplayName,
    setUserEmail,
    setUserDisplayName,
    setUserPhotoUrl,
  ] = useUserStore((state) => [
    state.userEmail,
    state.userPhotoUrl,
    state.userDisplayName,
    state.setUserEmail,
    state.setUserDisplayName,
    state.setUserPhotoUrl,
  ]);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserEmail(user.email);
        setUserDisplayName(user.displayName);
        setUserPhotoUrl(user.photoURL);
      }
    })();
  }, [isGoogleSignInLoading]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
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
    setIsSignInLoading(true);
    await signOut();

    setUserEmail(null);
    setUserDisplayName(null);
    setUserPhotoUrl(null);
    setIsSignInLoading(false);
  };

  return (
    <AppBar
      position='fixed'
      style={{ background: 'transparent', boxShadow: 'none' }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <LogoAppBar display={{ xs: 'none', md: 'flex' }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='black'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.id} onClick={handleCloseNavMenu}>
                  <Link
                    key={page.id}
                    to={`/${page.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography textAlign='center' color='black'>
                      {page.display}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
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

          <Box sx={{ flexGrow: 0, marginRight: 2 }}>
            <BadgesPopover />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!userEmail ? (
              <LoadingButton
                variant='outlined'
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                loading={isGoogleSignInLoading}
                onClick={handleSignIn}
              >
                Sign in with Google
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
                  loading={isGoogleSignInLoading}
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
