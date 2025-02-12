import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

function Cards({ onDelete, type }) {
  const clickRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onDeleteWrapper = () => (confirmDelete ? onDelete() : setConfirmDelete(true));

  useEffect(() => {
    function handleClickOutside(event) {
      if (clickRef.current && !clickRef.current.contains(event.target) && confirmDelete) {
        setConfirmDelete(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clickRef, confirmDelete]);

  return (
    <Card sx={{ margin: '20px', width: '80%' }}>
      <CardContent>{type}</CardContent>
      <CardActions>
        {onDelete && (
          <Button
            ref={clickRef}
            variant={confirmDelete ? 'contained' : 'outlined'}
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDeleteWrapper}
            sx={{ width: '100%' }}
          />
        )}
      </CardActions>
    </Card>
  );
}
export default Cards;
