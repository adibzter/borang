import { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { MenuOutlined } from '@mui/icons-material';

import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  {
    id: 'mobile',
    display: 'Mobile',
  },
];

const anchor = 'left';
export default function SwipeableTemporaryDrawer() {
  const [state, setState] = useState({
    left: false,
  });

  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {pages.map((page) => (
          <ListItem key={page.id} disablePadding>
            <ListItemButton onClick={() => navigate(`/${page.id}`)}>
              <ListItemText primary={page.display} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={toggleDrawer(anchor, true)}
          color='black'
        >
          <MenuOutlined />
        </IconButton>
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          {list(anchor)}
        </SwipeableDrawer>
      </>
    </div>
  );
}
