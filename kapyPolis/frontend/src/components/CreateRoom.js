import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
// import { CSRFToken } from 'django-react-csrftoken';

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

export default function CreateRoom() {
    // return <p>Create Room Page ee.</p>;
    // upper Grid is always a CONTAINER used in mui - uses css flexbox!
    // xs={12} is full grid so it fills the full grid.
    // typography = header
    // inputProps minimum of players = 1;
    // const currentNumberOfPlayers = 1;

    const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(2);
    const csrftoken = getCookie('csrftoken');
    const navigate = useNavigate();

    // useEffect(() => {
    //     fetch('/api/get_max_players/')
    //         .then(response => response.json())
    //         .then(data => {
    //             setMaxPlayers(data.max_players);
    //         });
    // }, []);

    // handles the amount of players after room creation
    const handleNumberOfPlayersChange = (e) => {
      setCurrentNumberOfPlayers(parseInt(e.target.value));
      console.log(currentNumberOfPlayers);
    };

    const handlePlayersChange = () => {
        console.log("Button pressed");
        const requestOptions = {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    max_players: currentNumberOfPlayers,
                }
            ),
        }
        fetch("/api/create-room", requestOptions)
        .then((response) => { 
            console.log(response);
            console.log(currentNumberOfPlayers);
            return response.json();
        }
            ) // take response and convert it to json obj
        .then((data) => { 
            console.log(data);
            navigate(`/room/${data.code}`);
        }) // log data
        .catch((error) => console.error(error));
    };
  

    return <Grid container spacing={1}> 

        {/* Header */}
        <Grid item xs={12} align="center">
            <Typography component='h1' variant='h1'>
                Create A Room
            </Typography>
        </Grid>
        
        {/* Amount of Players TextField */}
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField 
                    required
                    type="number"
                    value={currentNumberOfPlayers}
                    onChange={handleNumberOfPlayersChange}
                    inputProps={{ min: 2 }}
                    label="Number of Players"
                    helperText="Enter the number of players required for the room"
                    fullWidth
                    />
            </FormControl>
        </Grid>
        
        {/* Room creation Button */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={handlePlayersChange}
                sx={{
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#07da63',
                    },
                }}
                >
                Create Room
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