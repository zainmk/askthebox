import { useContext } from 'react';

import Box from '@mui/material/Box';
import SearchCard from './SearchCard.js';
import MediaCard from './MediaCard.js';
import CircularProgress from '@mui/material/CircularProgress';

import { MediaContext } from '../helpers/MediaContext.js';
import Cards from './Cards.js';


function CardList({ isLoading }){

    const { mediaList, setMediaList } = useContext(MediaContext)

    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
        <Cards type={<SearchCard />} />
        {isLoading ? <CircularProgress /> : mediaList?.map((media) => (
            <Cards 
                key={media.imdbID} 
                onDelete={ ()=> setMediaList(mediaList?.filter((entry) => entry.imdbID !== media.imdbID)) } 
                type={<MediaCard media={media} />}
            />
        ))}
    </Box>
    )
}
export default CardList;