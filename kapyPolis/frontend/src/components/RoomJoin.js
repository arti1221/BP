import React, { useState } from 'react';
import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate} from 'react-router-dom';

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
                    // socket.emit("join-room", { roomCode });
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

    return (<div className='flex flex-col flex-wrap gap-4'>

        {/* Header */}
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
              Join a Room
            </h1>
        </div>
     
        {/* TextField */}
        <div className='flex flex-row justify-center'>
            <div className='flex flex-col gap-4'>
                <label htmlFor="room-code-input" className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                Enter Room Code:
                </label>
                <input 
                type="text" 
                id="room-code-input" 
                value={roomCode}
                onChange={handleCodeChangeTextField}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
                placeholder="Code"
                required
                />
                {error && (
                <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>
        </div>

        {/* <Grid item xs={12} align="center">
            <TextField 
                error={error}
                label="Code"
                placeholder="Enter Room Code"
                value={roomCode}
                helperText={error}
                variant="outlined"
                onChange={handleCodeChangeTextField}
                />
        </Grid> */}

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

    </div>)
}
