import React, { Component, useState } from 'react';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

export default function RoomJoin(){
    // return <p>Room Join Page</p>;

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const csrftoken = getCookie('csrftoken');


    const handleCodeChangeTextField = (e) => {
        setRoomCode(e.target.value);
      };

      const handleRoomJoin = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    code: roomCode,
                }
            )
        };
        console.log('ROOM CODE: ')
        console.log(roomCode);
        fetch("/api/join-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate(`/room/${roomCode}`);
                } else if (response.status === 403) { // room is full
                    setError("Room is Full': 'Cannot Join Room.");
                } else {
                    setError("Room with expected code does not exist.");
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
                setError("An error occurred while joining the room.");
            });
    };

    return <Grid container spacing={3} align="center">

        {/* Header */}
        <Grid item xs={12} align="center">
            <Typography component='h1' variant='h1'>
                Join a Room
            </Typography>
        </Grid>
     
        {/* TextField */}
        <Grid item xs={12} align="center">
            <TextField 
                error={error}
                label="Code"
                placeholder="Enter Room Code"
                value={roomCode}
                helperText={error}
                variant="outlined"
                onChange={handleCodeChangeTextField}
                />
        </Grid>

        {/* Room join Button */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={handleRoomJoin}
                sx={{
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#07da63',
                    },
                }}
                >
                Join Room
            </Button>
        </Grid>

        {/* Room leaving Button */}
        <Grid item xs={12} align="center">
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
                to="/"
                component={Link}
                >
                Cancel
            </Button>
        </Grid>

    </Grid>
}
