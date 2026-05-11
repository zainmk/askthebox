import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { MediaContext } from '../helpers/MediaContext';
import { AdminContext } from '../helpers/AdminContext';

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button'

import AddIcon from '@mui/icons-material/Add';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
    },
}));


// styling for search bar above



const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const normalizeTmdbResult = (item) => ({
    Title: item.title || item.name || '',
    Year: (item.release_date || item.first_air_date || '').substring(0, 4),
    Type: item.media_type === 'movie' ? 'movie' : 'series',
    Poster: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : 'N/A',
    tmdbID: item.id,
});

function SearchCard(){

    const DEBOUNCE_DELAY = 300; // ms

    const { setMediaList } = useContext(MediaContext);
    const { setAdmin } = useContext(AdminContext);

    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);

    const onAddSearchEntry = async (rawEntry) => {
        const mediaType = rawEntry.Type === 'movie' ? 'movie' : 'tv';
        let imdbID = '';
        try {
            const res = await fetch(`${TMDB_BASE}/${mediaType}/${rawEntry.tmdbID}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`);
            const details = await res.json();
            imdbID = details.imdb_id || details.external_ids?.imdb_id || '';
        } catch (err) {
            console.log(err);
        }
        const entry = { ...rawEntry, imdbID, status: 'watch' };
        setMediaList((mediaList) =>
            mediaList?.some(m => (entry.imdbID && m.imdbID === entry.imdbID) || (entry.tmdbID && m.tmdbID === entry.tmdbID))
                ? mediaList
                : [entry, ...mediaList]
        );
        setSearchData([]);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchMovies = async () => {
                if (searchText.length > 1) {
                    try {
                        const isImdbId = /^tt\d+$/.test(searchText.trim());
                        let results = [];

                        if (isImdbId) {
                            const res = await fetch(`${TMDB_BASE}/find/${encodeURIComponent(searchText.trim())}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
                            const data = await res.json();
                            const combined = [
                                ...(data.movie_results || []).map(r => ({ ...r, media_type: 'movie' })),
                                ...(data.tv_results || []).map(r => ({ ...r, media_type: 'tv' })),
                            ];
                            results = combined.map(normalizeTmdbResult);
                        } else {
                            const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchText)}`);
                            const data = await res.json();
                            results = (data.results || [])
                                .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
                                .map(normalizeTmdbResult);
                        }
                        setSearchData(results);
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    setSearchData([]);
                }
            };
            fetchMovies();
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(delayDebounce);

    }, [searchText]);

    
    useEffect(() => {
        if(searchText === process.env.REACT_APP_ADMIN_KEY){
            setAdmin(true)
        }
    }, [searchText]);


    return (
        <>
            <AddIcon />
            <Search> 
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="title or IMDb ID (ex. 'tt1375666') ..."
                />  
            </Search>
            {searchData.length > 0 && <Table >
                <TableBody>
                    {searchData.map((result, index) => (
                        <React.Fragment key={index}>
                            <TableRow key={`${index}-value`} sx={{ [`& .MuiTableCell-root`]: { border: "none" } }}  >
                                <TableCell >{result.Title}</TableCell>
                                <TableCell >{result.Year}</TableCell>
                                <TableCell >{result.Type}</TableCell>
                            </TableRow>
                            <TableRow key={`${index}-button`} >
                                <TableCell colSpan={3} sx={{ paddingTop: "0px", paddingBottom: "25px" }} >
                                    <Button variant='outlined' onClick={()=>onAddSearchEntry(result)} sx={{ width: "100%" }}> + </Button>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>}
        </>
    )
}

export default SearchCard;