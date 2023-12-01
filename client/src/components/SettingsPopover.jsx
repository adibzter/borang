import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import {
  Box,
  Button,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faGear, faMedal } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../stores/userStore';
import { getUser, updateUser } from '../utils/api';

export default function SettingsPopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, userSettings, setUserSettings] = useUserStore((state) => [
    state.userEmail,
    state.userSettings,
    state.setUserSettings,
  ]);

  useEffect(() => {
    if (!userEmail) {
      return;
    }

    (async () => {
      const userData = await getUser(userEmail);

      if (userData.settings?.speed === undefined) {
        userData.settings = {
          speed: 50,
        };
        await updateUser(userEmail, {
          'settings.speed': userData.settings.speed,
        });
      }
      setUserSettings(userData.settings);
    })();
  }, [userEmail]);

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSettingsClicked = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleSpeedChanged = async (speed) => {
    const data = {
      'settings.speed': speed,
    };
    await updateUser(userEmail, data);

    userSettings.speed = speed;
    setUserSettings(userSettings);
  };

  return (
    <>
      <Tooltip title='Settings'>
        <IconButton
          aria-describedby={id}
          onClick={handleSettingsClicked}
          sx={{ marginX: 1 }}
        >
          <FontAwesomeIcon icon={faGear} />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 2,
            alignItems: 'center',
            width: 400,
          }}
        >
          <h2>Settings</h2>
          <Stack direction='column'>
            <Box sx={{ flexGrow: 0, marginY: 2, alignSelf: 'center' }}>
              <Tooltip title='Early Adopter'>
                <IconButton color='primary'>
                  <FontAwesomeIcon
                    icon={faBaby}
                    bounce
                    style={{ animationDuration: '2s' }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title='Skrin Premium'>
                <IconButton color='secondary'>
                  <FontAwesomeIcon
                    icon={faMedal}
                    fade
                    style={{ animationDuration: '2s' }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
              <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Speed
              </Typography>
              <Slider
                onChangeCommitted={(e, speed) => handleSpeedChanged(speed)}
                value={
                  userSettings?.speed === undefined ? 50 : userSettings.speed
                }
                step={null}
                marks={[
                  { value: 0, label: 'Slow (Safe)' },
                  { value: 50, label: 'Fast' },
                  { value: 100, label: 'Fastest (Dangerous)' },
                ]}
              />
            </Box>

            <Tooltip title='Manage Subscription'>
              <Button
                color='primary'
                variant='outlined'
                onClick={() =>
                  openNewTab(
                    `https://billing.stripe.com/p/login/4gwaFudEs44lgpO000?prefilled_email=${userEmail}`
                  )
                }
              >
                Manage Subscription
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
