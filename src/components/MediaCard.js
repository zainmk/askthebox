import * as React from 'react';
import { useState, useEffect, useContext } from 'react';


import { MediaContext } from '../helpers/MediaContext';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import LibraryTools from './LibraryTools';


function MediaCard({ media }){

    const { setMediaList } = useContext(MediaContext) 

    const [image, setImage] = useState()
    const [status, setStatus] = useState(media.status)

    // TODO: Consider fixing this hook so it has necessary dependencies but does not rerender too often.
    useEffect(() => {
        setMediaList(mediaList => {
            let newMediaList = [ ...mediaList ]
            const index = mediaList.findIndex( x => x.imdbID === media.imdbID);
            newMediaList[index]['status'] = status
            return newMediaList
        })
    }, [status, setMediaList, media.imdbID])

    useEffect(() => {
        if(media.Poster && media.Poster !== 'N/A'){
            fetch(media.Poster)
                .then(res => res.blob())
                .then(res => URL.createObjectURL(res))
                .then(res => setImage(res))
        }
    }, [media])

    return ( 
        <Box sx={{ display: "flex", gap:"20px" }}>
            <Box>
                <Paper elevation={24} sx={{ width :"120px" }}> 
                    <img alt={''} src={ image } style={{ width:"100%" }} />
                </Paper>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    {media.Type}
                </Typography>
                <Typography variant="h5" component="div">
                    {media.Title} | ({media.Year})
                </Typography>
                <Divider/>
                <Box sx={{ marginTop: "10px" }}>
                    <LibraryTools status={status} setStatus={setStatus} />
                </Box>
            </Box>
        </Box>
    )
}
export default MediaCard;