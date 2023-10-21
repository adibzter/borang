import * as React from 'react';
import Popover from '@mui/material/Popover';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';

export default function BadgesPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      <Tooltip title='Badges'>
        <IconButton
          color='secondary'
          aria-describedby={id}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faAward} />
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
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>Badges</h3>
          <Stack direction='row'>
            <FontAwesomeIcon icon={faAward} />
            <FontAwesomeIcon icon={faAward} />
            <FontAwesomeIcon icon={faAward} />
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
