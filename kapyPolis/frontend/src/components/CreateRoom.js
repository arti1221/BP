import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Alert, Collapse } from "@mui/material";
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

export default function CreateRoom(props) {

    CreateRoom.defaultProps = {
        max_players: 2,
        updateMaxPlayers: false,
        roomCode: null,
        onUpdateCallback: () => {},
        showSuccessMsg: false, // to indicate whether to show a success message or error message while updating in the room
        showErrorMsg: false, // to indicate whether to show a success message or error message while updating in the room
      };

    const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(CreateRoom.defaultProps.max_players);
    const csrftoken = getCookie('csrftoken');
    const [labelToShow, setLabelToShow] = useState(props.update ? "Update a Room" : "Create a Room");
    const [showSuccessMsg, setShowSuccessMsg] = useState(CreateRoom.defaultProps.showSuccessMsg);
    const [showErrorMsg, setShowErrorMsg] = useState(CreateRoom.defaultProps.showErrorMsg);
    const navigate = useNavigate();

    useEffect(() => {
        setLabelToShow(props.update ? "Update a Room" : "Create a Room");
        console.log(showSuccessMsg);
        console.log(showErrorMsg);
      }, [props.update, showSuccessMsg, showErrorMsg]);

    // handles the amount of players after room creation
    const handleNumberOfPlayersChange = (e) => {
      setCurrentNumberOfPlayers(parseInt(e.target.value));
      console.log(currentNumberOfPlayers);
    };

    const handlePlayersChange = () => {
        console.log("My csrf token", csrftoken);
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
            console.log("update: ", props.update);
            return response.json();
        }
            ) // take response and convert it to json obj
        .then((data) => { 
            console.log(data);
            navigate(`/room/${data.code}`);
        }) // log data
        .catch((error) => console.error(error));
    };
  

    const handleRoomUpdate = () => {
        console.log("My csrf token", csrftoken);
        const requestOptions = {
            method: 'PATCH',
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: JSON.stringify(
                {
                    code: props.roomCode,
                    max_players: currentNumberOfPlayers,
                }
            ),
        }
        fetch("/api/update-room", requestOptions)
        .then((response) => { 
            if (response.ok) {
                setShowSuccessMsg(true);
            } else {
                setShowErrorMsg(true);
            }
            const data = response.json();
            console.log("updating the room", currentNumberOfPlayers);
            console.log(data);
            props.onUpdateCallback();
        })
        .catch((error) => {
            console.log('eggeagsag');
            setShowErrorMsg(true);
            console.error(error) 
        });
    };

    const createRoom = () => {
        return (
          <div className='flex flex-col flex-wrap gap-4'>     
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => handlePlayersChange()}
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#07da63',
                        },
                    }}
                    >
                    {labelToShow}
                </Button>
            </Grid>

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
        </div>
        );
    };

    // the reason this is being separated is that I'm passing a button in the Room.js component when updating room - I do not want the user to be able to move back to the homepage.
    const updateRoom = () => {
        return (
          <div className='flex flex-col flex-wrap gap-4'>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleRoomUpdate()}
                sx={{
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#07da63',
                  },
                }}
              >
                {labelToShow}
              </Button>
            </Grid>
          </div>
        );
      };
      

    return (        
    <div className='flex flex-col flex-wrap gap-4'> 

<Grid item xs={12} align="center">
  <Collapse in={showSuccessMsg}>
    <Alert
      severity='success'
      onClose={() => setShowSuccessMsg(false)}
      sx={{
        textAlign: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        width: '18%',
      }}
    >
      Room Updated successfully.
    </Alert>
  </Collapse>
  <Collapse in={showErrorMsg}>
    <Alert
      severity='error'
      onClose={() => setShowErrorMsg(false)}
      sx={{
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      Please, try to increase the number of players. Room is full.
    </Alert>
  </Collapse>
</Grid>

        {/* Header */}
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
              {labelToShow}
            </h1>
        </div>
        {/* Amount of Players TextField */}
        <div className='flex flex-row justify-center'>       
          <div className='flex flex-col gap-4'>
              <label for="num-of-players" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  Number of players:
              </label>
              <input type="number" 
                      id="num-of-players" 
                      value={currentNumberOfPlayers}
                      onChange={handleNumberOfPlayersChange}
                      min="2"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="2"
              />
              </div>
         </div> 
        {props.update ? updateRoom() : createRoom()}
    </div>);
}