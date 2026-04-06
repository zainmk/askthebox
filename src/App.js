import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage.js";
import ProtectedRoutes from "./helpers/ProtectedRoutes.js";

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { MediaContext } from './helpers/MediaContext.js';
import { AdminContext } from './helpers/AdminContext.js';
import { useState } from 'react';

export default function App() {

  const [admin, setAdmin] = useState(false);
  const [mediaList, setMediaList] = useState()

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
    <MediaContext.Provider value={{ mediaList, setMediaList }}>
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' }})}>
      <BrowserRouter>
        <Routes>
          {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/" element={<MainPage />} />
          {/* </Route> */}
          {/* <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </MediaContext.Provider>
    </AdminContext.Provider>
  )
}