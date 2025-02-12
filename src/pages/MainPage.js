import '../App.js';
import React, { useState, useEffect, useContext } from 'react';

import TitleBar from '../components/TitleBar.js';
import CardList from '../components/CardList.js';
import Box from '@mui/material/Box';

import { UserContext } from '../helpers/userContext';

import { getMediaList, updateMediaList } from '../helpers/database.js';

function MainPage() {
  const { user, mediaList, setMediaList } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      // should only be ON this page when 'user' has a value
      getMediaList(user).then((res) => {
        setMediaList(res ? res : []);
        setIsLoading(false);
      });
    }
  }, [user, setMediaList]);

  useEffect(() => {
    updateMediaList(user, mediaList);
  }, [user, mediaList]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TitleBar />
      <Box sx={{ flex: 1, backgroundImage: "url('rollinghills.gif')" }}>
        <CardList isLoading={isLoading} />
      </Box>
    </Box>
  );
}

export default MainPage;
