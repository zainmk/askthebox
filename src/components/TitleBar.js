import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ArchiveOutlined } from '@mui/icons-material';

import Button from '@mui/material/Button';
import ProfileDrawer from './ProfileDrawer';

import { useNavigate } from "react-router-dom"
import { useContext } from 'react';

import { MediaContext } from '../helpers/MediaContext.js'

export default function TitleBar() {

  // TODO: ADD A MODAL TO ALLOW 'PASSWORD' ACCESS TO 'UNLOCK' APPROVALS

  const navigate = useNavigate();
  const { setUser } = useContext(MediaContext)

  // const onLogout = ()=> {
  //   setUser(null)
  //   localStorage.removeItem('user')
  //   navigate('/login')
  // }

  return (
    <>
      <AppBar position="static" >
        <Toolbar>
        <ProfileDrawer/>
          <Typography component="div" sx={{ flexGrow: 1, textAlign: "center"}}>
              a s k | BOX
          </Typography>
            {/* <Button color="inherit" onClick={ onLogout }> Logout </Button> */}
        </Toolbar>
      </AppBar>
    </>
  );
}