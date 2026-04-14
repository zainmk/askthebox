import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

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
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </MediaContext.Provider>
    </AdminContext.Provider>
  )
}