import * as React from 'react'
import { IconButton } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import RecommendIcon from '@mui/icons-material/Recommend';

import { AdminContext } from '../helpers/AdminContext';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function LibraryTools({ status, setStatus }){

    const { admin } = React.useContext(AdminContext);

    return (
        <>
            <ToggleButtonGroup size="small" value={status} exclusive onChange={(event, newStatus) => admin && setStatus(newStatus === status ? '' : newStatus)}>
                
                <ToggleButton value={"dislike"} sx={{ transform: "rotate(180deg)", "&.Mui-selected": { borderTop: "5px solid red"} }}>
                    <RecommendIcon />
                </ToggleButton>

                <ToggleButton value={"like"} sx={{"&.Mui-selected": { borderBottom: "5px solid green"} }}>
                    <RecommendIcon />
                </ToggleButton>

                <ToggleButton value={"watch"} sx={{"&.Mui-selected": { borderBottom: "5px solid blue"} }}>
                    <PreviewIcon />
                </ToggleButton>

            </ToggleButtonGroup>
        </>
    )

}
export default LibraryTools;