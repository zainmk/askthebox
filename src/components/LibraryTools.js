import * as React from 'react';
import { IconButton } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import RecommendIcon from '@mui/icons-material/Recommend';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function LibraryTools({ status, setStatus }) {
  return (
    <>
      <ToggleButtonGroup
        size="small"
        value={status}
        exclusive
        onChange={(event, newStatus) => setStatus(newStatus === status ? '' : newStatus)}
      >
        <ToggleButton value={'dislike'} sx={{ transform: 'rotate(180deg)' }}>
          <RecommendIcon />
        </ToggleButton>
        <ToggleButton value={'like'}>
          <RecommendIcon />
        </ToggleButton>
        <ToggleButton value={'watch'}>
          <PreviewIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
export default LibraryTools;
