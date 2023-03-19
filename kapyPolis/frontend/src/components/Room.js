import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";
import CreateRoom from "./CreateRoom"

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
    const [showUpdate, setshowUpdate] = useState(false); // to show update in update max players
    const { roomCode } = useParams();
    const [isHost, setIsHost] = useState(false);
    const csrftoken = getCookie('csrftoken');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => { // applies the method on render
        getRoomDetails();
        console.log("Is host after fetch: ", isHost);
    }, [roomCode, isHost, showUpdate]);

    const getRoomDetails = () => { 
        console.log("Retrieving room details for code " + roomCode);
        if (!roomCode) {
            return;
        }
        fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            if (!response.ok) {
              navigate("/");
              throw new Error(`Failed to fetch room with code ${roomCode}`);
            } else {
              console.log(response);
              console.log("Current players in response:", response.current_players);
              console.log("Current players in room:", currentNumberOfPlayers);
              return response.json();
            }
        })
        .then((data) => {
            const dataIsHost = data.is_host;
            console.log("logging data from response: Curr. Players: " , data.current_players, "host: ", dataIsHost);
            setIsHost(dataIsHost);
            setCurrentNumberOfPlayers(data.current_players);
            setMaxNumberOfPlayers(data.max_players);
            console.log("Is host after fetch in getRoomDetails: ", dataIsHost, "local var", isHost);
        })
        .catch((e) => {
            console.log("e");
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
          console.log(data.status);
            // todo change it to status!
          if (data.success === "Left the room and room has been deleted" || data.success === "Left the room") { 
            console.log("Leaving room and redirecting to homepage");
            // socket.emit("leave-room", { roomCode }); // emit the message to the server to handle players in the room.
             // todo: Reset the roomCode state to an empty string
            navigate(`/`);
          } else {
            console.log('Error after navigate')
            console.log(data.success)
            throw new Error(`Error: ${data}`);
          }
        } catch (error) {
          console.log(error);
          setError("An error occurred while leaving the room.");
        }
      };
      
      const showUpdateButtonIfHost = () => {
        // Update Max Players Button
        return (
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => setshowUpdate(true)}
              sx={{
                backgroundColor: '#3f51b5',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#07da63',
                },
              }}
            >
              Update Max Players
            </Button>
          </Grid>
        );
      };
      
      // room is in update mode and retrieves the max players
      const showUpdateRoom = () => {
        return (
        <Grid container spacing={1} align="center">
          <Grid item xs={12} align="center">
                <CreateRoom 
                  update={true} 
                  max_players={maxNumberOfPlayers}
                  roomCode={roomCode}
                  onUpdateCallback={getRoomDetails}
                  >
                </CreateRoom> 
            </Grid>

            {/* for now show settings */}
            <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={() => setshowUpdate(false)}
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
                Go Back
            </Button>
        </Grid>
        </Grid>
        );
      };

    if (showUpdate) {
      return showUpdateRoom();
    }
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
        {isHost ? showUpdateButtonIfHost() : null}

        {/* Leave Room Button  */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={() => leaveRoom()}
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
