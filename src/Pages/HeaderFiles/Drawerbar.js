import React, { useState } from 'react'
import { Drawer, ListItemButton, ListItemIcon, List, ListItemText, IconButton, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import Contact from "../HomeLayouts/Contact";

const Drawerbar = () => {
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <div>
      <Drawer open={openDrawer} 
      onClose={()=> setOpenDrawer(false)}
      >
        <List>
            <ListItemButton onClick={()=> setOpenDrawer(false)}>
                <ListItemIcon>
                    <ListItemText onClick={()=> navigate("/")}>Home</ListItemText>
                </ListItemIcon>
            </ListItemButton>
            <ListItemButton onClick={()=> setOpenDrawer(false)}>
                <ListItemIcon>
                    <ListItemText onClick={()=> navigate("/about")}>About</ListItemText>
                </ListItemIcon>
            </ListItemButton>
            <ListItemButton onClick={()=> setOpenDrawer(false)}>
                <ListItemIcon>
                    <ListItemText onClick={() => navigate("/contact")}>Contact Us</ListItemText>
                </ListItemIcon>
            </ListItemButton>
            <ListItemButton onClick={()=> setOpenDrawer(false)}>
                <ListItemIcon>
                    <ListItemText>Your Profile</ListItemText>
                </ListItemIcon>
            </ListItemButton>
            <ListItemButton onClick={()=> setOpenDrawer(false)}>
                <ListItemIcon>
                    <ListItemText onClick={()=>{navigate('/signin')}}>Signin</ListItemText>
                </ListItemIcon>
            </ListItemButton>
        </List>
      </Drawer>
      <IconButton sx={{color: 'gold', /* marginRight: '3rem' */}} onClick={()=> setOpenDrawer(!openDrawer)}>
        <MenuIcon/>
      </IconButton>
    </div>
  )
}

export default Drawerbar
