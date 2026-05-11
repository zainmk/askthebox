import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { MediaContext } from '../helpers/MediaContext';
import { AdminContext } from '../helpers/AdminContext';
import { fetchICSEvents, downloadICS } from '../helpers/icsExport';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CloseIcon from '@mui/icons-material/Close';

function MediaCard({ media }){

    const { setMediaList } = useContext(MediaContext)
    const { admin } = useContext(AdminContext)

    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if(media.Poster && media.Poster !== 'N/A'){
            fetch(media.Poster)
                .then(res => res.blob())
                .then(res => URL.createObjectURL(res))
                .then(res => setImage(res))
                .catch(res => setImage(null))
        }
    }, [media])

    const handleOpenPreview = async () => {
        setLoading(true);
        try {
            const data = await fetchICSEvents(media);
            setPreview(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        downloadICS(preview);
        setPreview(null);
    };

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
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {media.Type}
                    </Typography>
                    {media.Type === 'series' && (
                        <IconButton size="small" onClick={handleOpenPreview} disabled={loading} title="Export release dates to calendar" sx={{ padding: 0 }}>
                            {loading ? <CircularProgress size={18} /> : <CalendarMonthIcon fontSize="small" />}
                        </IconButton>
                    )}
                </Box>
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

                <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>{media.Title} — Calendar Preview</DialogTitle>
                    <DialogContent dividers sx={{ padding: 0 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {preview?.events.map((event, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{event.summary}</TableCell>
                                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{event.displayDate}</TableCell>
                                        <TableCell padding="checkbox">
                                            <IconButton size="small" onClick={() => setPreview(p => ({ ...p, events: p.events.filter((_, j) => j !== i) }))}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPreview(null)}>Cancel</Button>
                        <Button variant="contained" onClick={handleDownload}>Download .ics</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}
export default MediaCard;