import * as React from 'react';
import { useState, useContext } from 'react';
import {
  Box,
  Stack,
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import RecommendIcon from '@mui/icons-material/Recommend';
import ListIcon from '@mui/icons-material/List';

import { UserContext } from '../helpers/userContext';

export default function ProfileDrawer() {
  const { user } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <List>
        <div style={{ textAlign: 'center' }}>
          <p> {user} </p>
          <img src={'/thumbs.png'} alt="user avatar" width={'125px'} />
          <p> Level 1 </p>
        </div>
        <Divider />
      </List>
      <List>
        <ListItem key={'all'} disablePadding>
          <ListItemButton>
            {' '}
            <ListItemIcon>
              {' '}
              <ListIcon />{' '}
            </ListItemIcon>{' '}
            <ListItemText primary={'All'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'likes'} disablePadding>
          <ListItemButton>
            {' '}
            <ListItemIcon>
              {' '}
              <RecommendIcon />{' '}
            </ListItemIcon>{' '}
            <ListItemText primary={'Likes'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'dislikes'} disablePadding>
          <ListItemButton>
            {' '}
            <ListItemIcon>
              {' '}
              <RecommendIcon sx={{ transform: 'rotate(180deg)' }} />{' '}
            </ListItemIcon>{' '}
            <ListItemText primary={'Dislikes'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'watchlist'} disablePadding>
          <ListItemButton>
            {' '}
            <ListItemIcon>
              {' '}
              <PreviewIcon />{' '}
            </ListItemIcon>{' '}
            <ListItemText primary={'Watchlist'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer}>
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ color: 'white' }}>{user[0]}</Avatar>
        </Stack>
      </Button>
      <Drawer open={open} onClose={toggleDrawer}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
