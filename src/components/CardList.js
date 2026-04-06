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

        <p style={{ color:'white' }}> R E Q U E S T E D </p>
        <hr style = {{ width: '100%', borderColor: 'white' }} />
         {isLoading ? <CircularProgress /> : mediaList?.filter(entry => entry.status !== 'like')?.map((media) => (
            <Cards 
                key={media.imdbID} 
                onDelete={ ()=> setMediaList(mediaList?.filter((entry) => entry.imdbID !== media.imdbID)) } 
                type={<MediaCard media={media} />}
            />
        ))}

        <p style={{ color:'white' }}> A D D E D </p>
        <hr style = {{ width: '100%', borderColor: 'white' }} />
        
        {isLoading ? <CircularProgress /> : (
        mediaList
            ?.filter(entry => entry.status === 'like')
            ?.sort((a, b) => a.Title?.localeCompare(b.Title))
            ?.map((media) => (
                <Cards 
                    key={media.imdbID} 
                    onDelete={() =>
                    setMediaList(
                        mediaList?.filter((entry) => entry.imdbID !== media.imdbID)
                    )
                    } 
                    type={<MediaCard media={media} />}
                />
            ))
        )}

    </Box>
    )
}
export default CardList;