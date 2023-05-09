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
    const [roomId, setRoomId] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("")
    const navigate = useNavigate();

    const getRoomDetails = () => { 
        if (!roomCode) {
            return;
        }
        fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            if (!response.ok) {         
              navigate("/");
            } else {
              if (gameStarted == true) {
                navigate(`/room/${roomCode}/Game`);
              }
              return response.json();
            }
        })
        .then((data) => {
            const dataIsHost = data.is_host;
            const session_id = data.session_id;
            setSessionId(session_id);
            setIsHost(dataIsHost);
            setCurrentNumberOfPlayers(data.current_players);
            setMaxNumberOfPlayers(data.max_players);
            setGameStarted(data.game_started);
            setRoomId(data.id)
            setSelectedTemplate(data.template_name);
        })
        .catch((e) => {
            console.log("error", e);
        })
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
      
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ code: roomCode }),
        };
      
      
        try {
          const response = await fetch("/api/leave-room", requestOptions);
          const data = await response.json();
            // todo change it to status!
          if (data.success === "Left the room and room has been deleted" || data.success === "Left the room") { 
            console.log("Leaving room and redirecting to homepage");
            // socket.emit("leave-room", { roomCode }); // emit the message to the server to handle players in the room.
             // todo: Reset the roomCode state to an empty string
            navigate(`/`);
          } else {
            console.log('Error after navigate')
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
      
      const getBalance = async () => {
        try {
          const response = await fetch(`/api/get-template?name=${selectedTemplate}`, { credentials: 'include' }); // include headers
          const data = await response.json();
          return data.start_balance; // return the number directly
        } catch (e) {
          console.log("error balance", e);
          return null; // or return a default value
        }
      }
  
      const getRoomSessions = async () => {
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({
            room: roomId,
          }),
        };
      
        try {
          const response = await fetch('/api/get-room-sessions', requestOptions);
          const data = await response.json();
          console.log('got room sessions:', data);
          return data.session_ids;
        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      const handleRandomSession = async () => {
        const roomSessions = await getRoomSessions();
        console.log("r s", roomSessions);
        const randomSession = roomSessions[Math.floor(Math.random() * roomSessions.length)];
        console.log("rand ses", randomSession);
        const requestOptions = {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    code: roomCode,
                    current_turn: randomSession,
                }
            ),
        }
        fetch("/api/update-turn", requestOptions)
        .then((response) => { 
            return response.json();
        }
            ) // take response and convert it to json obj
        .then((data) => { 
            console.log("sesssion updated successfully.");
        }) // log data
        .catch((error) => console.error(error));
    };

      const setPlayersBalance = async () => {
        const balance = await getBalance();
        const requestOptions = {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    room: roomId,
                    balance: balance,
                }
            ),
        }
        fetch("/api/set-players-balance", requestOptions)
        .then((response) => { 
            return response.json();
        })
        .then((data) => { 
            console.log("balance ok: ", data);
        })
        .catch((error) => console.error(error));
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
              onClick={() => {startGame(); setPlayersBalance(); handleRandomSession();}} // TODO
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
