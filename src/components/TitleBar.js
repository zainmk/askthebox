import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThumbsUpDownTwoTone } from '@mui/icons-material';

import Button from '@mui/material/Button';
import ProfileDrawer from './ProfileDrawer';

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from '../helpers/userContext.js';

export default function TitleBar() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const onLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <ProfileDrawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            t h u m b s <ThumbsUpDownTwoTone />
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            {' '}
            Logout{' '}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
