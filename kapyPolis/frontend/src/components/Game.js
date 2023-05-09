import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import classNames from "classnames";


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
 
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function FlickeringNumber({ number, duration }) {
  const [currentNumber, setCurrentNumber] = useState(number);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNumber(getRandomInt(1, 6));
    }, duration);
    return () => clearInterval(interval);
  }, [duration]);

  return <span>{currentNumber}</span>;
}

class Player {
    constructor(sessionId, playerName, items, invVal, balance, position, roundsFrozen) {
      this.sessionId = sessionId;
      this.playerName = playerName;
      this.items = items;
      this.invVal = invVal;
      this.balance = balance;
      this.position = position;
      this.roundsFrozen = roundsFrozen;
    }
}

export default function Game() {
    const { roomCode } = useParams();
    const [sessionId, setSessionId] = useState("");
    const csrftoken = getCookie('csrftoken');
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0);

    const [allPlayers, setAllPlayers] = useState([]);
    const [turn, setTurn] = useState(false);
    const [numberOfSquares, setNumberOfSquares] = useState(6);
    const [currentTurn, setCurrentTurn] = useState("");

    // dice
    // const [diceNumber, setDiceNumber] = useState(1);
    // const [isRolling, setIsRolling] = useState(false);

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
              console.log("res", response);
              return response.json();
            }
        })
        .then((data) => {
            console.log("DATA", data);
            console.log("pl", data.players);

            // set the data for current player that are displayed on the top right corner
            const currentPlayer = data.players.find(player => player.session_id === data.session_id);
            if (currentPlayer) {
              setName(currentPlayer.player_name);
              setBalance(currentPlayer.balance);
              console.log("curr name: ", currentPlayer.player_name);
            }

            const players = data.players.map((playerData) => {
              return new Player(
                playerData.session_id,
                playerData.player_name,
                playerData.diff_items_amt,
                playerData.inventory_value,
                playerData.balance,
                playerData.position,
                playerData.rounds_frozen
              );
            });

            console.log("players likei", players);
            setAllPlayers(players);
            setSessionId(data.session_id);
            setCurrentTurn(data.current_turn);
            console.log("current turn", data.current_turn);
            console.log("ses", data.session_id);
        })
        .catch((e) => {
            console.log("error", e);
        })
    }

    // game functionality
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

    
    // useEffect(() => {
    //   // Call getRoomDetails on component mount
    //   getRoomDetails();
  
    //   // timer to call getRoomDetails every 0.1 second
    //   const timerId = setInterval(() => {
    //     getRoomDetails();
    //   }, 100);
  
    //   // Clean up the timer when the component unmounts
    //   return () => clearInterval(timerId);
    // }, [getRoomDetails]);

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
                <div class="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-full">
                    <span class="text-sm font-bold mr-4">{name}</span>
                    
                    <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full mr-4">
                        <svg class="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4zm0 2h4v8H8V8zm-2-2V4h8v2H6z" clip-rule="evenodd" />
                        </svg>
                      Inventory
                    </button>

                    <span class="bg-gray-100 text-gray-700 font-bold py-1 px-2 rounded-lg mr-4">
                        Balance: {balance}
                    </span>
                </div>
            </div>
        )
    };

    const ShowBottomDetails = () => {
        return (
          <div className={"fixed bottom-[1%] right-[5%] flex flex-row gap-4"}>
            <div class="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-full">
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
      

      const Square = ({ index }) => {
        return (
          <div className={"h-20 w-20 bg-gradient-to-br from-amber-700 via-orange-300 to-rose-800 rounded-xl flex items-center justify-center"}>
            {index}
          </div>
        )
      };
      
      const SquareTransparent = () => {
        return (
          <div className={"h-20 w-20 bg-transparent rounded-xl"}></div>
        )
      };

      
      const SquareBoard = ({ numberOfSquares }) => {
        const lastIndex = numberOfSquares - 1;
        let counter = 0;
      
        const squares = [];
        for (let i = 0; i < numberOfSquares; i++) {
          squares.push([]);
          for (let j = 0; j < numberOfSquares; j++) {
            squares[i].push(null);
          }
        }
      
        for (let i = 0; i < numberOfSquares; i++) {
          squares[0][i] = counter++;
        }
        for (let i = 1; i < numberOfSquares; i++) {
          squares[i][numberOfSquares - 1] = counter++;
        }
        for (let i = numberOfSquares - 2; i >= 0; i--) {
          squares[numberOfSquares - 1][i] = counter++;
        }
        for (let i = numberOfSquares - 2; i >= 1; i--) {
          squares[i][0] = counter++;
        }
      
        return (
          <div className={"flex flex-col gap-4"}>
            {squares.map((row, indexRow) => (
              <div className={"flex flex-row gap-4"} key={`row-${indexRow}`}>
                {row.map((value, indexCol) => {
                  if (value !== null) {
                    return <Square index={value} key={`square-${indexRow}-${indexCol}`} />;
                  } else {
                    return <SquareTransparent key={`transparent-${indexRow}-${indexCol}`} />;
                  }
                })}
              </div>
            ))}
          </div>
        );
      };
      

    
    // dice
const Dot = ({ scale }) => {
  return (
      <div className={"w-6 h-6 bg-gray-700 rounded-full transition duration-100" + (scale ? " animate-ping" : "")}></div>
  );
};

const Dice = () => {
  const [numberOfDots, setNumberOfDots] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
      if (rolling) return;
      setRolling(true);
      setTimeout(() => {
          setRolling(false);
          const newValue = Math.floor(Math.random() * 6) + 1;
          setNumberOfDots(newValue);
      }, 2000);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <p className={"text-black"}>{numberOfDots}</p>
        <div className="min-h-screen flex items-center justify-center">
            <div onClick={() => {
                if (!rolling) {
                    rollDice()
                }
            }}
                 className={"h-36 w-36 bg-white rounded-xl shadow-xl transform flex flex-col justify-around p-4 transition duration-1000 cursor-pointer" + (rolling ? " rotate-180" : "")}>
                <div className="space-x-4 pt-1 flex flex-row justify-center items-center">
                    <Dot scale={rolling}/>
                    {numberOfDots > 1 ?
                        <Dot scale={rolling}/> : null
                    }
                    {
                        numberOfDots > 2 && (numberOfDots < 4 || numberOfDots === 6) ?
                            <Dot scale={rolling}/> : null
                    }
                </div>
                {numberOfDots === 5 ?
                    <div className="space-x-4 pt-1 flex flex-row justify-center items-center"><Dot scale={rolling}/>
                    </div> : null
                }
                {
                    numberOfDots > 3 ?
                        <div className="space-x-4 pt-1 flex flex-row justify-center items-center">
                            <Dot scale={rolling}/>
                            {
                                numberOfDots >= 4 ?
                                    <Dot scale={rolling}/> : null
                            }
                            {numberOfDots > 5 ?
                                <Dot scale={rolling}/> : null
                            }
                        </div> : null
                }
            </div>
        </div>
    </div>
);
};

    return (
      <div className={"flex flex-row min-h-screen w-screen bg-gradient-to-br from-sky-900 via-violet-600 to-amber-200"}>
        <ShowTopDetails/>
        <ShowBottomDetails/>
    
        <div className="flex-1 m-4 mt-16">
          {/* Your game board code here */}
          <SquareBoard numberOfSquares={numberOfSquares}/>
        </div>
    
        
        <div className="w-2/5 p-4 mt-16">
          <div className="flex flex-wrap -mx-4">
            {allPlayers.map((player) => (
              <div className="w-1/2 px-4 mb-4">
                <div className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-2 rounded-lg ${currentTurn === player.sessionId ? 'border-2 border-gradient-to-r from-red-400 to-yellow-500' : 'border-2 border-gray-800'}`}>
                  <h2 className="text-xl font-bold mb-2">{player.playerName}</h2>
                  <p className="text-gray-300">Balance: {player.balance}</p>
                  <p className="text-gray-300">Inventory Value: {player.invVal}</p>
                  <p className="text-gray-300">Different items: {player.items}</p>
              </div>

              </div>
            ))}

            <Dice />

          </div>
        </div>


      </div>
    );
    
}
