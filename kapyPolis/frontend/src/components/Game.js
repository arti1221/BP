import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import classNames from "classnames";

import {SET_NUMBER_ROLLED, SET_HAS_ROLLED, SET_HAS_ROLLS, SET_FIRST_ROLL, SET_SECOND_ROLL, SET_LAST_ROLLED} from '../redux/actions/action'
import {useSelector, shallowEqual} from "react-redux"; 
import {useDispatch} from 'react-redux';


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

class Player {
    constructor(sessionId, playerName, items, invVal, balance, position, roundsFrozen, color) {
      this.sessionId = sessionId;
      this.playerName = playerName;
      this.items = items;
      this.invVal = invVal;
      this.balance = balance;
      this.position = position;
      this.roundsFrozen = roundsFrozen;
      this.color = color;
    }
}

class ShopItem {
  constructor(name, image, priceMin, priceMax) {
    this.name = name;
    this.image = image;
    this.priceMin = priceMin;
    this.priceMax = priceMax;
  }
}

class PlayerItem {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
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

    const [numberOfSquares, setNumberOfSquares] = useState(7);
    const [currentTurn, setCurrentTurn] = useState("");

    const [selectedTemplate, setSelectedTemplate] = useState("");

    // Game Data - templates and UI
    const [card1Img, setCard1Img] = useState("");
    const [card1pos, setCard1Pos] = useState(0);
    const [card1Min, setCard1Min] = useState(0);
    const [card1Max, setCard1Max] = useState(0);

    const [card2Img, setCard2Img] = useState("");
    const [card2pos, setCard2Pos] = useState(0);
    const [card2Min, setCard2Min] = useState(0);
    const [card2Max, setCard2Max] = useState(0);

    const [card3Img, setCard3Img] = useState("");
    const [card3pos, setCard3Pos] = useState(0);
    const [card3Reset, setCard3Reset] = useState(false);

    const [card4Img, setCard4Img] = useState("");
    const [card4pos, setCard4Pos] = useState(0);
    const [card4RoundsStop, setCard4RoundsStop] = useState(0);

    const [card5Img, setCard5Img] = useState("");
    const [card5pos, setCard5Pos] = useState(0);
    const [card5Min, setCard5Min] = useState(0);
    const [card5Max, setCard5Max] = useState(0);

    const [shopName, setShopName] = useState("");
    const [shopImg, setShopImg] = useState("");
    const [shopPos, setShopPos] = useState(0);
    const [shopItems, setShopItems] = useState([]);

    const [numFields, setNumFields] = useState(0);
    const [reward, setReward] = useState(0);

    //
    const dispatch = useDispatch();
    const [numberRolled] = useSelector((state) => [state.global.numberRolled], shallowEqual);
    const [hasRolled] = useSelector((state) => [state.global.hasRolled], shallowEqual);
    const [hasRolls] = useSelector((state) => [state.global.hasRolls], shallowEqual);
    const [lastRolled] = useSelector((state) => [state.global.lastRolled], shallowEqual);
    const [rolledSix, setRolledSix] = useState(false);
    const [firstRoll] = useSelector((state) => [state.global.firstRoll], shallowEqual);
    const [secondRoll] = useSelector((state) => [state.global.secondRoll], shallowEqual);
    
    // inventory
    const [showModal, setShowModal] = useState(false);

    const showPlayerInventory = () => {
      setShowModal(true);
    };
  
    const hidePlayerInventory = () => {
      setShowModal(false);
    };


// state variables
const [roomDetailsLoaded, setRoomDetailsLoaded] = useState(false);

    const getRoomDetails = async () => { 
      if (!roomCode) {
        return;
      }
      try {
        const response = await fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' });
        if (!response.ok) {
          navigate("/");
        } else {
          const data = await response.json();
    
          const currentPlayer = data.players.find(player => player.session_id === data.session_id);
          if (currentPlayer) {
            setName(currentPlayer.player_name);
            setBalance(currentPlayer.balance);
          }
    
          const players = data.players.map((playerData) => {
            return new Player(
              playerData.session_id,
              playerData.player_name,
              playerData.diff_items_amt,
              playerData.inventory_value,
              playerData.balance,
              playerData.position,
              playerData.rounds_frozen,
              ""
            );
          });
    
          setAllPlayers(players);
          setSessionId(data.session_id);
          setCurrentTurn(data.current_turn);
    
          setSelectedTemplate(data.template_name);
    
          setCard1Pos(data.card_type1_pos);
          setCard2Pos(data.card_type2_pos);
          setCard3Pos(data.card_type3_pos);
          setCard4Pos(data.card_type4_pos);
          setCard5Pos(data.card_type5_pos);
          setShopPos(data.shop_pos);

          setRoomDetailsLoaded(true);
        }
      } catch (e) {
        console.log("error", e);
      }
    };
    
    const setPlayerColors = async () => {
      const colors = ["red", "blue", "green", "yellow"];
      const updatedPlayers = allPlayers.map((player, index) => {
        const colorIndex = index % colors.length;
        const color = colors[colorIndex];
        return {...player, color};
      });
      setAllPlayers(updatedPlayers);
    };


    const getTemplateDetails = async () => {
      fetch(`/api/get-template?name=${selectedTemplate}`, { credentials: 'include' }) // include headers
      .then((response) => {
          // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            return response.json();
      })
      .then((data) => {
        // setBalance(data.start_balance);
        // setTemplateName(data.name);
        // setFirstName(data.name);
        
        setShopName(data.shop_name);

        // cards
        setCard1Min(data.card_type1_mvup);
        setCard1Max(data.card_type1_mvup_max);
        setCard1Img(data.card_type1_image);

        setCard2Min(data.card_type2_mvdown);
        setCard2Max(data.card_type2_mvdown_max);
        setCard2Img(data.card_type2_image);

        setCard3Reset(data.card_type3_reset);
        setCard3Img(data.card_type3_image);

        setCard4RoundsStop(data.card_type4_round_stop);
        setCard4Img(data.card_type4_image);

        setCard5Min(data.card_type5_min);
        setCard5Max(data.card_type5_max);
        setCard5Img(data.card_type5_image);

        setShopImg(data.shop_image); // TODO ADD SHOP ITEMS! CREATE A CLASS FOR IT
        
        // console.log("win1, win2", data.winning_pos1, data.winning_pos2);
        // setWin1(data.winning_pos1);
        // setWin2(data.winning_pos2);
        // setWinAmt(data.winning_amt);

        setNumFields(data.number_of_rounds);
        setReward(data.reward_per_round);

        const items = data.shop_items.map((item) => {
          return new ShopItem(
            item.name,
            item.image,
            item.price,
            item.price_max
          );
        });

        setShopItems(items);
        
        })
        .catch((e) => {
            console.log("error fetching template", e);
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


    // TODO: ADD GET-PLAYERS METHOD THAT IS BEING FETCHED EVERY SECOND OR SO
    
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
      
      useEffect(() => {
        if (selectedTemplate) {
          getTemplateDetails();
        }
      }, [selectedTemplate]);
      
      useEffect(() => {
      }, [showModal]);

      useEffect(() => {
        if (roomDetailsLoaded) {
          setPlayerColors();
        }
      }, [roomDetailsLoaded]);



    const showLog = () => {

    }  

    const showInventory = () => {
      console.log("showing inventory");
      return (
        <div className={`fixed z-50 inset-0 overflow-y-auto ${showModal ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg" style={{marginTop: '15vh'}}>
              <div className="bg-gradient-to-r from-gray-500 to-white p-4">
                <div className="pb-4 sm:pb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Inventory</h2>
                </div>
                <div className="pt-4 sm:pt-6">
                  {/* <p className="text-gray-700">You have no items to display currently</p> */}
                  <PlayerItemList/>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-500 to-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={hidePlayerInventory}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
    

    const ShowTopDetails = () => {
      return (
        <div className={"fixed top-[1%] right-[5%] flex flex-row gap-4"}>
          <div className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white rounded-full">
            <span className="text-sm font-bold mr-4">{name}</span>
    
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full mr-4"
              onClick={showPlayerInventory}
            >
              <svg
                className="h-6 w-6 inline-block mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4zm0 2h4v8H8V8zm-2-2V4h8v2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Inventory
            </button>
    
            <span className="bg-gray-100 text-gray-700 font-bold py-1 px-2 rounded-lg mr-4">
              Balance: {balance}
            </span>
          </div>
          
        </div>
      );
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
      
      const SquareTransparent = () => {
        return (
          <div className={"h-20 w-20 bg-transparent rounded-xl"}></div>
        )
      };
      
      const SquareBoard = ({ numberOfSquares, card1Img, card1pos, card2Img, card2pos, card3Img, card3pos, card4Img, card4pos, card5Img, card5pos, shopImg, shopPos }) => {
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
      
        // console.log("card positions: ", card1pos, card2pos, card3pos, card4pos, card5pos, shopPos);

        return (
          <div className={"flex flex-col gap-4"}>
            {squares.map((row, indexRow) => (
              <div className={"flex flex-row gap-4"} key={`row-${indexRow}`}>
                {row.map((value, indexCol) => {
                  if (value !== null) {
                    // Check if current value matches any of the cardXpos values
                    if (value === card1pos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={card1Img} />;
                    } else if (value === card2pos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={card2Img} />;
                    } else if (value === card3pos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={card3Img} />;
                    } else if (value === card4pos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={card4Img} />;
                    } else if (value === card5pos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={card5Img} />;
                    } else if (value === shopPos) {
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={true} imageUrl={shopImg} />;
                    } else {
                      // If current value doesn't match any of the cardXpos values, render a normal Square
                      return <SquareF index={value} key={`square-${indexRow}-${indexCol}`} useImage={false} imageUrl={null} />;
                    }
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
  // const [numberOfDots, setNumberOfDots] = useState(1);
  const [rolling, setRolling] = useState(false);
  const dispatch = useDispatch();
  // const numberOfDots = useSelector((state) => state.global.numberRolled, shallowEqual);
  // const firstRoll = useSelector((state) => state.global.firstRoll);
  // const secondRoll = useSelector((state) => state.global.secondRoll);

  // const [hasRolled] = useSelector((state) => [state.global.hasRolled], shallowEqual);
  // const [hasRolls] = useSelector((state) => [state.global.hasRolls], shallowEqual);
  // const [lastRolled] = useSelector((state) => [state.global.lastRolled], shallowEqual);
  const numberOfDots = useSelector((state) => state.global.numberRolled, shallowEqual);
  const firstRoll = useSelector((state) => state.global.firstRoll, shallowEqual);
  const secondRoll = useSelector((state) => state.global.secondRoll, shallowEqual);
  const hasRolled = useSelector((state) => state.global.hasRolled, shallowEqual);
  const hasRolls = useSelector((state) => state.global.hasRolls, shallowEqual);
  const lastRolled = useSelector((state) => state.global.lastRolled, shallowEqual);
  
  const rollDice = () => {
      if (rolling) return;
      setRolling(true);
      setTimeout(() => {
          setRolling(false);
          const newValue = Math.floor(Math.random() * 6) + 1;
          console.log(newValue);
          dispatch({type: SET_NUMBER_ROLLED, value: newValue});
          dispatch({type: SET_HAS_ROLLED, value: true});
          if (firstRoll && secondRoll) {
            dispatch({type: SET_FIRST_ROLL, value: false});
            if (newValue != 6) {
              dispatch({type: SET_HAS_ROLLS, value: false});
            }
          } else if (!firstRoll) {
            dispatch({type: SET_SECOND_ROLL, value: false});
            dispatch({type: SET_HAS_ROLLS, value: false});
          }
      }, 2000);
  };

  useEffect(() => {
  }, [firstRoll, secondRoll]);

  useEffect( () => {
    // console.log("Rolled a new number", numberOfDots);
  }, [numberOfDots, hasRolls])

  return (
    <div className="flex flex-col items-center justify-center h-100">
        <p className="text-black mb-4">{numberOfDots}</p>
        <div className="min-h-100 flex items-center justify-center">
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

// used to show Items
const Item = ({ name, price, imageUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="text-center font-bold mb-2">{name}</div>
      <div className="overflow-hidden w-36 h-40 bg-cover bg-center bg-no-repeat rounded-md mb-2" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className="text-center font-bold">{price} USD</div>
    </div>
  );
};


const playerItemList = [
  new PlayerItem('Player 1', 'http://127.0.0.1:8000/media/shopitem/feecb19b-0fbf-4329-a28e-5983cae0841f.png', 10.0),
  new PlayerItem('Player 2', 'http://127.0.0.1:8000/media/shopitem/8c605682-b69c-4670-9500-b8589874d323.png', 15.0),
  new PlayerItem('Player 3', 'http://127.0.0.1:8000/media/shopitem/721f41e2-6f6f-43f3-9d19-585cab45dd82.png', 20.0),
  new PlayerItem('Player 4', 'http://127.0.0.1:8000/media/shopitem/721f41e2-6f6f-43f3-9d19-585cab45dd82.png', 24.0),
  new PlayerItem('Player 5', 'http://127.0.0.1:8000/media/shopitem/721f41e2-6f6f-43f3-9d19-585cab45dd82.png', 25.0),
  new PlayerItem('Player 66', 'http://127.0.0.1:8000/media/shopitem/721f41e2-6f6f-43f3-9d19-585cab45dd82.png', 8.0),
  new PlayerItem('Player 734', 'http://127.0.0.1:8000/media/shopitem/721f41e2-6f6f-43f3-9d19-585cab45dd82.png', 19.0),
];

const PlayerItemList = () => {
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      {playerItemList.map((playerItem, index) => (
        <div key={playerItem.name}>
          <Item name={playerItem.name} price={playerItem.price} imageUrl={playerItem.image} />
        </div>
      ))}
    </div>
  );
};

// player figurines

const Figurine = ({ color }) => (
  <div
    className="rounded-full h-9 w-9 flex items-center justify-center"
    style={{ backgroundColor: color }}
  >
    <svg className="text-white h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 10H14V11H6V10ZM4 4V16H16V4H4Z" />
    </svg>
  </div>
);



const Square = ({ index, children }) => {
  return (
    <div className="h-20 w-20 bg-gradient-to-br from-amber-700 via-orange-300 to-rose-800 rounded-xl flex items-center justify-center">
      {index}
      {children}
    </div>
  );
};

const SquareWithImage = ({ index, imageUrl, children }) => {
  return (
    <div
      className={"h-20 w-20 bg-gradient-to-br from-amber-700 via-orange-300 to-rose-800 rounded-xl flex items-center justify-center"}
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" }}
    >
      {index}
      {children}
    </div>
  );
};

const SquareF = ({ index, useImage, imageUrl }) => {
  const colors = ["red", "blue", "green", "yellow"];
  const playersOnSquare = allPlayers.filter((player) => player.position === index);
  const numFigurines = playersOnSquare.length;

  let figurines = [];
  for (let i = 0; i < numFigurines; i++) {
    figurines.push(<Figurine color={playersOnSquare[i].color} key={i} />);
  }

  let content = null;
  if (numFigurines === 1) {
    content = (
      <div className="w-full h-full flex items-center justify-center">
        {figurines}
      </div>
    );
  } else if (numFigurines === 2) {
    content = (
      <div className="w-full h-full flex flex-row items-center justify-center">
        {figurines}
      </div>
    );
  } else if (numFigurines === 3) {
    content = (
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="w-1/2 flex flex-col items-center justify-center">
          {figurines[0]}
          {figurines[1]}
        </div>
        <div className="w-1/2 flex items-center justify-center">
          {figurines[2]}
        </div>
      </div>
    );
  } else if (numFigurines === 4) {
    content = (
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="w-1/2 flex flex-col items-center justify-center">
          {figurines[0]}
          {figurines[1]}
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          {figurines[2]}
          {figurines[3]}
        </div>
      </div>
    );
  }

  if (useImage) {
    return <SquareWithImage index={index} imageUrl={imageUrl} >{content}</SquareWithImage>;
  } else {
    return (
      <div className="w-50 h-50">
        <Square index={index}>{content}</Square>
      </div>
    );
  }
};


const switchTurn = async () => {
    // Find the index of the current player
    const currentIndex = allPlayers.findIndex(player => player.sessionId === currentTurn);

    // Calculate the index of the next player
    const nextIndex = (currentIndex + 1) % allPlayers.length;

    // Set the CurrentTurn to the sessionId of the next player
    const nextPlayer = allPlayers[nextIndex];
    const nextTurn = nextPlayer.sessionId;

    console.log("switching turn from: to :", currentTurn, nextTurn);

    setCurrentTurn(nextTurn);

    const requestOptions = {
      method: 'POST',
      headers: { 
          "Content-Type": "application/json",
          'X-CSRFToken': csrftoken, // include the CSRF token in the headers
      },
      body: JSON.stringify(
          {
              code: roomCode,
              current_turn: nextTurn,
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
}

const resetStatesToDefault = () => {
  console.log("reseting data to default.");
  setRolledSix(false);
  // dispatch({type: SET_NUMBER_ROLLED, value: 1}); // causes to rerender the dice and sets the number to 1.
  dispatch({type: SET_HAS_ROLLED, value: false});
  dispatch({type: SET_HAS_ROLLS, value: true});
  dispatch({type: SET_FIRST_ROLL, value: true});
  dispatch({type: SET_SECOND_ROLL, value: true});
  dispatch({type: SET_LAST_ROLLED, value: null});

  setRolledSix(false);
}


const handleNoRolls = () => {
  console.log("logging states after finishing rolling: ", numberRolled, hasRolled, hasRolls, firstRoll, secondRoll, lastRolled);
  if (!hasRolls) {
    console.log("no rolls left, last rolled", numberRolled);
    if (secondRoll) {
      console.log("also rolled six");
    }

    const amtToMove = !secondRoll ? 6 + numberRolled : numberRolled;
    console.log("amt to move", numberRolled);
    handleNewPosition(amtToMove);
  }
  console.log("som tu", hasRolls);
}

const handleNewPosition = (amtToMove) => {
  console.log("hanglind pos", amtToMove);
  const playerIndex = allPlayers.findIndex(player => player.sessionId === sessionId);
  const oldPos = allPlayers[playerIndex].position;
  const newPos = oldPos + amtToMove; // this number overflows the amt of fields, handeled separately in next methods
  console.log("new pos", newPos);
  handlePlayerMove(newPos);
}

const handlePlayerMove = (newPos) => {
  console.log("handling players move");
  if (newPos >= numFields) {
    incrementPlayersBalance(reward);
  }
  movePlayer(newPos);
}

// reusable for cards as well as the round end
const incrementPlayersBalance = (amt) => {
  const playerIndex = allPlayers.findIndex(player => player.sessionId === sessionId);
  allPlayers[playerIndex].balance += amt;
  console.log("Balance incremented with amount: ", amt);
}

const decrementPlayersBalance = (amt) => {
  const playerIndex = allPlayers.findIndex(player => player.sessionId === sessionId);
  const newBal = allPlayers[playerIndex].balance - amt;
  if (newBal < 0) {
    allPlayers[index].balance = 0;
  } else {
    allPlayers[index].balance = newBal;
  }
  console.log("bal decremented");
}

const movePlayer = (position) => {
  if (position >= numFields) {
    console.log("Player passed the round."); // todo log it into a log.
  }

  const playerIndex = allPlayers.findIndex(player => player.sessionId === sessionId);
  const newPlayerPosition = (position + allPlayers[playerIndex].position) % numFields; // TODO check if pos not more

  handleCards(newPlayerPosition)

  // allPlayers[playerIndex].position = position % numFields;

}

const handleCards = (position) => {
  const playerIndex = allPlayers.findIndex(player => player.sessionId === sessionId);

  if (card1pos == position) {
    const amtToMove = generateCard1Rule();
    const newPos = (position + amtToMove) % numFields;
    allPlayers[playerIndex].position = newPos;
  } else if (card2pos == position) {
    const amtToMove = generateCard2Rule();
    const newPos = (position + amtToMove) % numFields;
    allPlayers[playerIndex].position = newPos;
  } else if (card3pos != null && card3pos == position) { // reset to start, TODO check whether it is set or not.
    allPlayers[playerIndex].position = 0;
  } else if (card4pos == position) {
    allPlayers[playerIndex].roundsFrozen = card4RoundsStop;
    allPlayers[playerIndex].position = position % numFields;
    console.log(allPlayers[playerIndex]);
  } else if (card5pos == position) {
    const ballChange = generateCard5Balance(card5Min, card5Max);
    if (ballChange > 0) {
      incrementPlayersBalance(ballChange);
    } else {
      decrementPlayersBalance(ballChange);
    }
    allPlayers[playerIndex].position = newPos;
  } else { // normal field without any "card"

    allPlayers[playerIndex].position = position % numFields;
    console.log("normal pos");
  }

  resetStatesToDefault();
  switchTurn();
  // switch turn
  console.log("new player position to be set and turn switched", position);
}

const generateCard1Rule = () => {
  const range = card1Max - card1Min;
  const randomNumber = (Math.random() * range) + card1Min;
  return randomNumber;
}

const generateCard2Rule = () => {
  const range = card2Max - card2Min;
  const randomNumber = (Math.random() * range) + card2Min;
  return randomNumber;
}

const generateCard5Balance = (number1, number2) => {
  const randomNumber = Math.round(Math.random() * (number2 - number1) + number1);
  const randomSign = Math.random() < 0.5 ? -1 : 1;
  const finalNumber = randomNumber * randomSign;
  return finalNumber;
}

useEffect(() => {
  // console.log("hasRolled useeff", hasRolled, hasRolls, lastRolled);
  console.log("has no rolls left");
  handleNoRolls();
}, [hasRolls]);


    return (
      <div className={"flex flex-row min-h-screen w-screen bg-gradient-to-br from-sky-900 via-violet-600 to-amber-200"}>
        <ShowTopDetails/>
        <ShowBottomDetails/>

        {showModal ? showInventory() : null}

        <div className="flex-1 m-4 mt-16">
          {/* Your game board code here */}
          <SquareBoard
                    numberOfSquares={numberOfSquares}
                    card1Img={card1Img}
                    card1pos={card1pos}
                    card2Img={card2Img}
                    card2pos={card2pos}
                    card3Img={card3Img}
                    card3pos={card3pos}
                    card4Img={card4Img}
                    card4pos={card4pos}
                    card5Img={card5Img}
                    card5pos={card5pos}
                    shopImg={shopImg}
                    shopPos={shopPos}
                  />

            <SquareF index={0} useImage={true} imageUrl={card1Img}/>
        </div>
    
        

        <div className="w-2/5 p-4 mt-16">
          <div className="flex flex-wrap -mx-4">
            {allPlayers.map((player) => (
              <div className="w-1/2 px-4 mb-4">
                <div className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-2 rounded-lg ${currentTurn === player.sessionId ? 'border-2 border-gradient-to-r from-red-400 to-yellow-500' : 'border-2 border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">{player.playerName}</h2>
                  <div className="inline-block ml-2"><Figurine color={player.color} /></div>
                </div>
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
