import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, ButtonGroup } from "@mui/material";
import Alert from './Alert'
import {useDispatch} from 'react-redux';
import {SET_ENTERED} from '../redux/actions/action'


export default function MainMenu() {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch({type: SET_ENTERED, value: true});
    };

    return (
    <div className='flex flex-col flex-wrap gap-4'>

        {/* Header */}
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                Main Menu
            </h1>
        </div>
        
        <Grid item xs={12} align="center">
            <ButtonGroup color="primary" aria-label="outlined primary button group" orientation="vertical">
                {/* Join Room Button */}
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#2196f3',
                        },
                    }}
                    to="/login"
                    component={Link}
                    >
                    Login
                </Button>

                {/* Create Room Button */}
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#07da63',
                        },
                    }}
                    to="/create-user"
                    component={Link}
                    >
                    Register
                </Button>
{/* TODO!!! */}
                {/* Login */}
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#00bcd4',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#008ba3',
                        },
                    }}
                    onClick={handleClick}
                    to="/"
                    component={Link}
                    >
                    Enter Menu
                </Button>     
                            
            </ButtonGroup>

        </Grid>

        </div>
    );
}