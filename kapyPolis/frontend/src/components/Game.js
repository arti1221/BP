import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";

// TODO

export function Square() {
    return (
        <div className={"h-20 w-20 bg-amber-500 rounded-xl"}/>
    )
}

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

export default function Game() {
    const { roomCode } = useParams();
    const [sessionId, setSessionId] = useState("");
    const csrftoken = getCookie('csrftoken');
    const navigate = useNavigate();

    // TODO, set room details, balance, etc.
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
              console.log(response);
              return response.json();
            }
        })
        .then((data) => {
            setSessionId(data.session_id);
        })
        .catch((e) => {
            console.log("error", e);
        })
    }

    const leaveGame = async () => {
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
            console.log("dd", data.success);
            if (data.success === "Left the room and room has been deleted" || data.success === "Left the room") { 
              console.log("Leaving room and redirecting to homepage");
              navigate(`/`);
            } else {
              console.log('Error after navigate')
              throw new Error(`Error: ${data}`);
            }
          } catch (error) {
            console.log("error", error);
          }
    }

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
          if (data.success === "Player removed successfully") { 
            console.log("Leaving Room and removing player from the database");
          } else {
            console.log('Error, player not found')
            throw new Error(`Error: ${data}`);
          }
        } catch (error) {
          console.log("error", e);
        }
      };

      useEffect(() => {
        getRoomDetails();
      }, []);


    const showLog = () => {
        
    }  

    const showPlayerInventory = () => {

    }  

    const ShowTopDetails = () => {
        return (
            <div className={"fixed top-[1%] right-[5%] flex flex-row gap-4"}>
                <div class="flex items-center px-4 py-2 bg-gray-800 text-white rounded-full">
                    <span class="text-sm font-bold mr-4">John Doe</span>
                    
                    <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full mr-4">
                        <svg class="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4zm0 2h4v8H8V8zm-2-2V4h8v2H6z" clip-rule="evenodd" />
                        </svg>
                    Inventory
                    </button>

                    <span class="bg-gray-100 text-gray-700 font-bold py-1 px-2 rounded-lg mr-4">
                        Balance: $10000
                    </span>
                </div>
            </div>
        )
    };

    const ShowBottomDetails = () => {
        return (
          <div className={"fixed bottom-[1%] right-[5%] flex flex-row gap-4"}>
            <div class="flex items-center px-4 py-2 bg-gray-800 text-white rounded-full">
              <button class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => {removePlayer(); leaveGame();}}
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Leave Game
              </button>
            </div>
          </div>
        );
      };
      
    return (
        <div className={"bg-pink-200"}>
        
        <ShowTopDetails/>
        <ShowBottomDetails/>


        </div> 
    )
}
