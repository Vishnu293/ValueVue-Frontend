import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
    </div>
  )
}

export default Loading
