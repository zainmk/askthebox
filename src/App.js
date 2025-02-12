import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage.js';
import ProtectedRoutes from './helpers/ProtectedRoutes.js';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { UserContext } from './helpers/userContext';
import { useState } from 'react';

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('user')); // TODO: create a custom hook for local storage values
  const [mediaList, setMediaList] = useState();

  return (
    <UserContext.Provider value={{ user, setUser, mediaList, setMediaList }}>
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<MainPage />} />
            </Route>
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserContext.Provider>
  );
}
