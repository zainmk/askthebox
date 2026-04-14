import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { MediaContext } from '../helpers/MediaContext';
import { AdminContext } from '../helpers/AdminContext';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

function MediaCard({ media }){

    const { setMediaList } = useContext(MediaContext) 
    const { admin } = useContext(AdminContext) 

    const [image, setImage] = useState()

    useEffect(() => {
        if(media.Poster && media.Poster !== 'N/A'){
            fetch(media.Poster)
                .then(res => res.blob())
                .then(res => URL.createObjectURL(res))
                .then(res => setImage(res))
                .catch(res => setImage(null))
        }
    }, [media])

    const handleTitleClick = () => {
        const newPlexID = window.prompt("Enter Plex ID for this media:");
        if (newPlexID !== null && newPlexID.trim() !== '') {
            setMediaList(mediaList => {
                let newMediaList = [...mediaList];
                const index = mediaList.findIndex(x => x.imdbID === media.imdbID);
                newMediaList[index] = { ...newMediaList[index], plexID: newPlexID.trim() };
                return newMediaList;
            });
        }
    };

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
                 <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {admin ? (
                        <Typography 
                            variant="h5" 
                            component="div" 
                            onClick={handleTitleClick} 
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            {media.Title} | ({media.Year})
                        </Typography>
                    ) : (
                        <Link href={`https://www.imdb.com/title/${media.imdbID}/`} target="_blank" rel="noopener noreferrer" underline="hover" color='inherit'>
                            <Typography variant="h5" component="div">
                                {media.Title} | ({media.Year})
                            </Typography>
                        </Link>
                    )}
                    {media.plexID && (
                        <Link href={`https://app.plex.tv/desktop#!/server/${process.env.REACT_APP_PLEX_SERVER_ID}/details?key=%2Flibrary%2Fmetadata%2F${media.plexID}`} target="_blank" rel="noopener noreferrer" underline="hover">
                            <img src="/plexlogo.png" alt="plex logo" style={{ width: "20px", height: "20px", cursor: "pointer" }}/>
                        </Link>
                    )}
                 </Box>
                <Divider/>
            </Box>
        </Box>
    )
}
export default MediaCard;