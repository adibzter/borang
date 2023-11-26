import * as React from 'react';
import Popover from '@mui/material/Popover';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faGear, faMedal } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../stores/userStore';

export default function SettingsPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userEmail] = useUserStore((state) => [state.userEmail]);

  const openNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title='Settings'>
        <IconButton
          aria-describedby={id}
          onClick={handleClick}
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
            alignItems: 'center',
            width: 300,
            height: 200,
          }}
        >
          <h3>Settings</h3>
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
