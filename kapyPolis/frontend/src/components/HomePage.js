import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import RoomJoin from './RoomJoin';
import CreateRoom from './CreateRoom';
import Room from './Room';
import Template from './Template';
import CreateTemplate from './CreateTemplate';
import Help from './help';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, ButtonGroup } from "@mui/material";

export default function HomePage() {

    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        // This will be called only once after the component is mounted
        if (!roomCode) {
            return;
        }
        fetchData();
      }, [roomCode]);

    const fetchData = async () => { // TODO FIX
        fetch('/api/users-room')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setRoomCode(data.code);
        })
      };

    const createHomePage = () => {
        return (
        <Grid container spacing={3} align="center">
            
            {/* Header */}
            <Grid item xs={12} align="center">
                <Typography component='h3' variant='h3'>
                    KapyPolis
                </Typography>
            </Grid>
            
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
{/* TODO!!! */}
                    {/* Create Template Button */}
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

          </Grid>
        );
      }

    return (
    <BrowserRouter>
        <Routes>
            {/* <Route path='/' element={createHomePage()}/> */}
             <Route
                path="/"
                element={
                    roomCode ? (
                    <Navigate to={`room/${roomCode}`} />
                    ) : (
                    createHomePage()
                    )
                }
                /> 
            <Route path='/join' element={<RoomJoin />}/>
            <Route path='/create' element={<CreateRoom />}/>
            <Route path='/room/:roomCode' element={<Room/>}/>
            <Route path='/template' element={<CreateTemplate/>}/>
            <Route path='/help' element={<Help/>}/>

            {/* <Route path='/room/:roomCode' element={<Room clearRoomCode={clearRoomCode} />} /> */}
            <Route path='*' element={<h1>ERROR 404 PAGE NOT FOUND.</h1>}/> // 404 not found page, every route that is valid has to be above this root.
        </Routes>
    </BrowserRouter>
    )
}
