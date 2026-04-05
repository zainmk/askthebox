import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ArchiveOutlined } from '@mui/icons-material';

import Button from '@mui/material/Button';
import ProfileDrawer from './ProfileDrawer';

import { useNavigate } from "react-router-dom"
import { useContext } from 'react';


export default function TitleBar() {

  return (
    <>
      <AppBar position="static" >
        <Toolbar>
        <ProfileDrawer/> 
         <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="movie.png" alt="movie text" style={{ height: '48px', marginBottom: '4px' }} />
            {/* <Typography component="div"> a s k | BOX </Typography> */}
          </div>
            {/* <Button color="inherit" onClick={ onLogout }> Logout </Button> */}
        </Toolbar>
      </AppBar>
    </>
  );
}