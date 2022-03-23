import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState, useEffect } from 'react';
import '../style/header.css'
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IonIcon } from "react-ion-icon";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import loginAction from '../app/actions/loginAction';
import Popover from '@mui/material/Popover';

import {
    useNavigate
} from "react-router-dom";
import _GLobal_Link from './global';
function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();
    const signout = () => {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_name");
        dispatch(loginAction(false, ""));
        navigate("/");
    }


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [state, setState] = React.useState({
        left: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>

                <ListItem button>
                    <ListItemIcon style={{ fontSize: 25, alignSelf: 'center', color: 'gray' }}>
                        <IonIcon name="apps"></IonIcon>
                    </ListItemIcon>
                    <ListItemText primary={"categories"} />
                </ListItem>

                <ListItem button>
                    <ListItemIcon style={{ fontSize: 25, alignSelf: 'center', color: 'gray' }}>
                        <IonIcon name="card"></IonIcon>
                    </ListItemIcon>
                    <ListItemText primary={"Seller"} />
                </ListItem>

            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    const dispatch = useDispatch();
    const userName = useSelector((state) => state.loginReducer._user_name);
    const loginState = useSelector((state) => state.loginReducer._isLogin);
    useEffect(() => {
        if (localStorage.getItem("session_token")) {
            dispatch(loginAction(true, localStorage.getItem("user_name")));
        }
        
    })
    return (
        <div>
            
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: "10px" }}>
                    <div onClick={signout} style={{ fontSize: 15, alignSelf: 'center', color: 'gray', cursor: 'pointer' }} >
                        <span sx={{ p: 2 }}>Sign out</span>
                    </div>
                </div>
            </Popover>
            <div className='headBody' >
                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <Link to='/'>
                        <img alt='' height={100} width={120} src={_GLobal_Link._link_simple + 'aimeos/1.d/logo.png'} />
                    </Link>
                    <Link className='link' to='/'>Categories</Link>
                    <Link className='link' to='/'>Seller</Link>
                </div>
                <div style={{ alignItems: 'center', flex: 1 }}>
                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flex: 1, background: '#f0f1f5', color: 'gray', boxShadow: 'none', }}>
                        <InputBase
                            sx={{ flex: 1, fontFamily: "'Oswald', sans-serif" }}
                            placeholder="Search for model,brand .."
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <Link className='link' to='/'>Contact us</Link>
                    <Link style={{ fontSize: 30, alignSelf: 'center', color: 'gray' }} className='link' to='/'>
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </Link>
                    {useSelector((state) => state.loginReducer._isLogin) === true ?
                        <div style={{ fontSize: 30, alignSelf: 'center', color: 'gray', display: 'flex', alignItems: 'center' }} className='link'>
                            <Button style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center' }} aria-describedby={id} variant="contained" onClick={handleClick}>
                                <div>
                                    <span style={{ textTransform: 'lowercase' }}>{userName}</span>
                                </div>
                                <div style={{ fontSize: 20, color: 'white', marginLeft: "5px", marginTop: "3px" }}>
                                    <IonIcon name="person-circle-outline"></IonIcon>
                                </div>
                            </Button>

                        </div> :
                        <Link style={{ fontSize: 30, alignSelf: 'center', color: 'gray' }} className='link' to='/login'>
                            <IonIcon name="person-circle-outline"></IonIcon>
                        </Link>
                    }
                </div>
            </div>

            <div className='mobile-menu'>
                <div className='icon-mobile'>
                    {['left'].map((anchor) => (
                        <React.Fragment key={anchor}>
                            <Link style={{ fontSize: 30, alignSelf: 'center', color: 'gray' }} to='/' onClick={toggleDrawer(anchor, true)}>
                                <IonIcon name="menu-sharp"></IonIcon>
                            </Link>
                            <Drawer
                                anchor={'left'}
                                open={state.left}
                                onClose={toggleDrawer(anchor, false)}
                            >
                                {list(anchor)}
                            </Drawer>
                        </React.Fragment>
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <Paper component="form" sx={{ p: '0px 10px', display: 'flex', flex: 1, background: '#f0f1f5', color: 'gray', boxShadow: 'none', }}>
                        <InputBase
                            sx={{ flex: 1, fontFamily: "'Oswald', sans-serif" }}
                            placeholder="Search for model,brand .."
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="submit" sx={{ p: '5px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div className='icon-mobile'>
                    <Link style={{ fontSize: 25, alignSelf: 'center', color: 'gray' }} to='/'>
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </Link>
                </div>
                <div className='icon-mobile'>
                    <Link style={{ fontSize: 25, alignSelf: 'center', color: 'gray' }} to='/'>
                        <IonIcon name="person-circle-outline"></IonIcon>
                    </Link>
                </div>
            </div>
        </div>
    );
} export default Header;