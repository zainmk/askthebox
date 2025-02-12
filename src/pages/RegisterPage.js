import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createUser, getUser } from '../helpers/database.js';

import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onCreateAccount = () => {
    const valWhitespace = (str) => /\s/.test(str);
    const valAlphanumeric = (str) => /^[A-Za-z0-9]*$/.test(str);

    // TODO: make 'toasts' for users to display alerts
    if (
      valWhitespace(username) ||
      valWhitespace(password) ||
      !valAlphanumeric(password) ||
      !valAlphanumeric(username)
    ) {
      alert('invalid entry, no whitespace or special characters');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } else if (username === '' || password === '') {
      alert('username or password is empty');
    } else if (password !== confirmPassword) {
      alert('passwords are not the same');
    } else {
      // check if user already exists
      getUser(username).then((res) => {
        if (res) {
          alert('user already exists');
        } else {
          createUser({ username, password });
          alert('welcome to thumbs! - ' + username);
          navigate('/login');
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
          register
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
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          label="password"
        />
        <TextField
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          label="confirm password"
          type="password"
        />
        <Button variant="contained" onClick={onCreateAccount}>
          {' '}
          create account{' '}
        </Button>
        <Button variant="contained" onClick={() => navigate('/login')}>
          {' '}
          back{' '}
        </Button>
      </Paper>
    </Box>
  );
}
export default RegisterPage;
