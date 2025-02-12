import React from 'react';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

import { getUser } from '../helpers/database.js';
import { UserContext } from '../helpers/userContext';

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(UserContext);

  const onLogin = () => {
    if (username === '' || password === '') {
      alert('Enter a name and password');
    } else {
      getUser(username).then((res) => {
        if (!res) {
          // user was not found
          alert('user not found');
        } else {
          if (res.password === password) {
            setUser(username);
            navigate('/');
          } else {
            alert('wrong password');
          }
        }
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(./thumbs.png)',
        height: '100vh',
        width: '100wh',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '120px 40px 120px 40px',
        }}
      >
        <Typography variant="h4" align="center">
          Login
        </Typography>
        <TextField
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          label="username"
        />
        <TextField
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          label="password"
          type="password"
        />
        <Button variant="contained" onClick={onLogin}>
          Login
        </Button>
        <Button variant="contained" onClick={() => navigate('/register')}>
          Create Account
        </Button>
      </Paper>
    </Box>
  );
}
export default LoginPage;
