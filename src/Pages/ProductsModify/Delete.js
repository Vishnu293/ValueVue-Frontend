import React, {useState, useEffect} from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
  } from "@mui/material";

const Delete = ({ open, selectedProduct, handleCloseDialogs, handleConfirmDelete }) => {
  const [productName, setProductName] = useState('');
  
  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.productName);
    }
  }, [selectedProduct]);

  return (
    <div>
        <Dialog open={open} onClose={()=> {}}>
            <DialogTitle>{`Delete ${productName}?`}</DialogTitle>
            <DialogActions>
            <Button onClick={handleCloseDialogs} color="primary" sx={{ fontWeight: "600", "&:hover": {color: "gold"} }}>
                Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" variant="contained" sx={{fontWeight: "600", "&:hover": {color: "gold"}}}>
                Delete
            </Button>
            </DialogActions>
      </Dialog>
    </div>
  )
}

export default Delete
