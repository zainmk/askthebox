import '../App.js';
import React, { useState, useEffect, useContext } from "react";

import TitleBar from '../components/TitleBar.js';
import CardList from '../components/CardList.js';
import Box from '@mui/material/Box';


import { MediaContext } from '../helpers/MediaContext';

import { getMediaList, updateMediaList } from '../helpers/database.js'

function MainPage() {

  const { mediaList, setMediaList } = useContext(MediaContext);
  const [ isLoading, setIsLoading ] = useState(false)

  useEffect(()=> {

    setIsLoading(true)

    getMediaList().then(res => {
      setMediaList(res ? res : [])
      setIsLoading(false)
    })

  }, [setMediaList])

  useEffect(()=> {
    updateMediaList(mediaList)
  }, [mediaList])


  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height:"100vh" }}>
        <TitleBar />
        <Box sx={{ flex: 1, backgroundImage:"url('rollinghills.gif')" }}>
          <CardList isLoading={isLoading} />
        </Box>
      </Box>
  );
}

export default MainPage;