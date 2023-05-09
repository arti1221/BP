import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
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
    const [numberOfSquares, setNumberOfSquares] = useState(7);
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
      

    const Square = () => {
      return (
        <div className={"h-20 w-20 bg-gradient-to-br from-amber-700 via-orange-300 to-rose-800 rounded-xl"}></div>
      )
    };


    const SquareTransparent = () => {
      return (
        <div className={"h-20 w-20 bg-transparent rounded-xl"}></div>
      )
    };
    
    // dice
const [rolling, setRolling] = useState(false);
const [value, setValue] = useState(null);

const rollDice = () => {
  if (rolling) return;
  setRolling(true);
  setTimeout(() => {
    setValue(getRandomInt(1, 6));
    setRolling(false);
  }, 2000);
};

  const DiceRoller = () => { 
 
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative w-56 h-56">
          <AnimatePresence>
            {rolling && (
              <motion.div
                key="dice"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0, rotate: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center rounded-full"
              >
                <motion.div
                  animate={{ scale: 1.1 }}
                  transition={{
                    yoyo: Infinity,
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-green-400 to-green-500 blur shadow-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer"
            onClick={rollDice}
          >
            {rolling ? (
              <FlickeringNumber number={value || "?"} duration={50} />
            ) : (
              <span className="text-6xl font-bold text-gray-600">
                {value || "?"}
              </span>
            )}
          </div>
        </div>
        <button
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          onClick={rollDice}
          disabled={rolling}
        >
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>
      </div>
    );
  };

  
    return (
      <div className={"flex flex-row min-h-screen w-screen bg-gradient-to-br from-sky-900 via-violet-600 to-amber-200"}>
        <ShowTopDetails/>
        <ShowBottomDetails/>
    
        <div className="flex-1 m-4">
          {/* Your game board code here */}
          <div className={"flex flex-col gap-4"}>
            {Array(numberOfSquares).fill(null).map((curr, indexRow) => (
              <div className={"flex flex-row gap-4"}>
                {Array(numberOfSquares).fill(null).map((current, index) => {
                  if (indexRow === 0 || indexRow === numberOfSquares - 1 || index === 0 || index === numberOfSquares - 1) {
                    return <Square />
                  }
                  return <SquareTransparent />
                })}
              </div>
            ))}
          </div>
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

            <DiceRoller />

          </div>
        </div>


      </div>
    );
    
}
