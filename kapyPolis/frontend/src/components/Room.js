import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";


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

export default function Room() {
    const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(0);
    const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState(0);
    const { roomCode } = useParams();
    const csrftoken = getCookie('csrftoken');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => { // applies the method on render
        getRoomDetails();
    }, []);

    const getRoomDetails = () => { 
        console.log("Retrieving room details for code " + roomCode);
        fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' })
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            console.log(response);
            return response.json();
        })
        .then((data) => {
            setCurrentNumberOfPlayers(data.current_players);
            setMaxNumberOfPlayers(data.max_players);
        })
        console.log("the token " + csrftoken);
    }

    const leaveRoom = async () => {
        console.log("Fetching data for leaving room");
        console.log("My room code", roomCode);
        console.log("My csrf token", csrftoken);
      
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ code: roomCode }),
        };
      
        console.log(requestOptions);
        console.log(roomCode);
      
        try {
          const response = await fetch("/api/leave-room", requestOptions);
          const data = await response.json();
          console.log(data);
          if (data.success === "Left the room and room has been deleted") {
            console.log("Leaving room and redirecting to homepage");
             // todo: Reset the roomCode state to an empty string
            navigate(`/`);
          } else {
            throw new Error(`Error: ${data}`);
          }
        } catch (error) {
          console.log(error);
          setError("An error occurred while leaving the room.");
        }
      };
      
      
      

    return (
        <Grid container spacing={1} align="center">

            {/* Header */}
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    RoomCode: {roomCode}
                </Typography>
            </Grid>
            
            {/* Number of players in the room */}
            <Grid item xs={12} align="center">
                <Typography component='h6' variant='h6'>
                    Current number of players: {currentNumberOfPlayers} / {maxNumberOfPlayers}
                </Typography>
            </Grid>

        {/* Update Max Players Button */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                // onClick={handleRoomJoin}
                sx={{
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#07da63',
                    },
                }}
                to="/"
                component={Link}
                >
                Update Max Players
            </Button>
        </Grid>
        
        {/* Leave Room Button  */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={leaveRoom}
                sx={{
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#c0392b',
                    },
                }}
                // to="/"
                // component={Link}
                >
                Leave Room
            </Button>
        </Grid>

        </Grid> 
    )
}
