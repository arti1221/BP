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
    const [playerName, setPlayerName] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const navigate = useNavigate();

    const getRoomDetails = () => { 
        console.log("Retrieving room details for code " + roomCode);
        if (!roomCode) {
            return;
        }
        fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            if (!response.ok) {         
              navigate("/", {state: {errorMsg: `Failed to fetch room with code ${roomCode}`}});
            } else {
              if (gameStarted == true) {
                navigate(`/room/${roomCode}/Game`);
              }
              console.log(response);
              console.log("Current players in response:", response.current_players);
              console.log("Current players in room:", currentNumberOfPlayers);
              return response.json();
            }
        })
        .then((data) => {
            const dataIsHost = data.is_host;
            const session_id = data.session_id;
            console.log("game started: ", gameStarted);
            console.log("logging data from response: Curr. Players: " , data.current_players, "host: ", dataIsHost);
            console.log("Session ID: ", session_id);
            console.log("data: ", data)
            setSessionId(session_id);
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

    useEffect(() => {
      // Call getRoomDetails on component mount
      getRoomDetails();
  
      // timer to call getRoomDetails every 0.1 second
      const timerId = setInterval(() => {
        getRoomDetails();
      }, 100);
  
      // Clean up the timer when the component unmounts
      return () => clearInterval(timerId);
    }, [getRoomDetails, roomCode, isHost, showUpdate]);

    const leaveRoom = async () => {
        console.log("Fetching data for leaving room");
      
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

      const removePlayer =  async () => {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ 
            code: roomCode,
            session_id: sessionId, 
          }),
        };
        try {
          const response = await fetch("/api/delete-player", requestOptions);
          const data = await response.json();
          console.log(data);
          console.log(data.status);
            // todo change it to status!
          if (data.success === "Player removed successfully") { 
            console.log("Leaving Room and removing player from the database");
            // socket.emit("leave-room", { roomCode }); // emit the message to the server to handle players in the room.
             // todo: Reset the roomCode state to an empty string
          } else {
            console.log('Error, player not found')
            throw new Error(`Error: ${data}`);
          }
        } catch (error) {
          console.log(error);
          setError("An error occurred while leaving the room.");
        }
      };

      const startGame = () => {
          const requestOptions = {
            method: 'PATCH',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    code: roomCode,
                    game_started: true,
                }
            ),
        }
        fetch("/api/start-game", requestOptions)
        .then((response) => { 
            const data = response.json();
            if (response.ok) {
              setGameStarted(true);
              console.log("Game started with current number of players: ", currentNumberOfPlayers);
            }
        })
        .catch((error) => {
            console.error(error) 
        });
      }
      
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
                  backgroundColor: '#2196F3',
                },
              }}
            >
              Update Max Players
            </Button>
          </Grid>
        );
      };

      const showStartGameIfHost = () => {
        return (
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              size="large"
              onClick={startGame} // TODO
              sx={{
                backgroundColor: '#07da63',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#05a549',
                },
              }}
            >
              Start The Game
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
      <div className='flex flex-col flex-wrap gap-4'>

            {/* Header */}
            <div className='flex justify-center'> 
              <h4 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                RoomCode: {roomCode}
              </h4>
            </div>
            
            {/* Number of players in the room */}
            <div className='flex justify-center'> 
              <h6 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                  Current number of players: {currentNumberOfPlayers} / {maxNumberOfPlayers}
              </h6>
            </div>

        {/* Update Max Players Button */}
        {isHost ? showStartGameIfHost() : null}
        {isHost ? showUpdateButtonIfHost() : null}

        {/* Leave Room Button  */}
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                size="large"
                onClick={() => {removePlayer(); leaveRoom();}}
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

        </div> 
    )
}
