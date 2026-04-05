import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { MediaContext } from '../helpers/MediaContext';

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



function SearchCard(){

    const DEBOUNCE_DELAY = 300; // ms

    const { setMediaList } = useContext(MediaContext);

    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);

    const onAddSearchEntry = (entry) => {
        setMediaList((mediaList) => mediaList?.filter(media => media.imdbID === entry.imdbID).length > 0 ? mediaList : [entry, ...mediaList])
        setSearchData([]) 
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchMovies = async () => {
                if (searchText.length > 1) {
                    try {
                        const res = await fetch(`https://www.omdbapi.com/?apikey=ee46ee2e&s=${searchText}`); // 522792c1 (another token)
                        const res_byID = await fetch(`https://www.omdbapi.com/?apikey=ee46ee2e&i=${searchText}`)
                        const data = await res.json();
                        const data_byID = await res_byID?.json().catch(() => []);
                        const results = data.Response !== 'False' ? data.Search : data_byID;
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
                    placeholder="Search..."
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