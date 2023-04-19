import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, ButtonGroup } from "@mui/material";
import Alert from './Alert'
import MainMenu from './MainMenu'
import {useSelector, shallowEqual} from "react-redux"; 

export default function HomePageMenu() {
    const location = useLocation();

    const [isLoggedIn, entered] = useSelector((state) => [state.global.isLoggedIn, state.global.entered], shallowEqual);

    const loadMainMenu = () => {
        return MainMenu();
    }

    const loadTemplateButton = () => {
        return (
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
            to="/template"
            component={Link}
            >
            Create a Template
        </Button>   
        );
    }

    const loadMenu = () => {
        return (
            <div className='flex flex-col flex-wrap gap-4'>
        
                {location?.state?.errorMsg ? <Alert msg={location.state.errorMsg}/> : null}
        
                {/* Header */}
                <div className='flex justify-center'> 
                    <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                        Create a Template
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
                            to="/join"
                            component={Link}
                            >
                            Join a Room
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
                            to="/create"
                            component={Link}
                            >
                            Create a Room
                        </Button>

                        {/* Create Template Button */}
                        {isLoggedIn ? loadTemplateButton() : null}
                        {/* Help */}
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                '&:hover': {
                                backgroundColor: '#c0392b',
                                },
                            }}
                            to="/help"
                            component={Link}
                            >
                            Help
                        </Button>
                    </ButtonGroup>
        
                </Grid>
            </div>
        );
    }

    return (
        <div>
            {(!isLoggedIn && !entered)? loadMainMenu() : loadMenu()}
        </div>
    )
}
