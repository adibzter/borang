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

const pages = ['Products', 'Pricing', 'About', 'Privacy Policy'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGoogleSignInLoading, setIsSignInLoading] = useState(false);

  const [
    userPhotoUrl,
    userDisplayName,
    setUserEmail,
    setUserDisplayName,
    setUserPhotoUrl,
  ] = useUserStore((state) => [
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
        setIsSignedIn(true);
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignIn = async () => {
    setIsSignInLoading(true);
    await signIn();
    setIsSignInLoading(false);
  };

  const handleSignOut = async () => {
    setIsSignInLoading(true);
    await signOut();
    setIsSignedIn(false);
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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center' color='black'>
                    {page}
                  </Typography>
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
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!isSignedIn ? (
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
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
