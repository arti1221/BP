import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import classNames from "classnames";

import {SET_NUMBER_ROLLED, SET_HAS_ROLLS, SET_FIRST_ROLL, SET_SECOND_ROLL, SET_IS_ROLLING, SET_SHOW_SHOP} from '../redux/actions/action'
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
    constructor(session_id, player_name, diff_items_amt, inventory_value, balance, position, rounds_frozen, color) {
      this.session_id = session_id;
      this.player_name = player_name;
      this.diff_items_amt = diff_items_amt;
      this.inventory_value = inventory_value;
      this.balance = balance;
      this.position = position;
      this.rounds_frozen = rounds_frozen;
      this.color = color;
    }
}

class ShopItem {
  constructor(name, image, price, price_max) {
    this.name = name;
    this.image = image;
    this.price = price;
    this.price_max = price_max;
  }
}

class PlayerItem {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
  }
}

class LogItem {
  constructor(logged_at, text) {
    this.logged_at = logged_at;
    this.text = text;
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

    const [roomId, setRoomId] = useState(null);

    //
    const dispatch = useDispatch();
    const [numberRolled, hasRolls, firstRoll, secondRoll, rolling, showShopModal] = useSelector((state) => [state.global.numberRolled,
      state.global.hasRolls,
      state.global.firstRoll,
      state.global.secondRoll,
      state.global.isRolling,
      state.global.showShopModal,
    ], shallowEqual);
    
    // inventory
    const [showModal, setShowModal] = useState(false);
    const [inventory, setInventory] = useState([]);

    const [shopItemList, setShopItemList] = useState([]);

    const [log, setLog] = useState([]);

    const showPlayerInventory = () => {
      setShowModal(true);
    };
  
    const hidePlayerInventory = () => {
      setShowModal(false);
    };

    const showShopInventory = async () => {
      dispatch({type: SET_SHOW_SHOP, value: true});
    }

    const hideShopInventory = () => {
      dispatch({type: SET_SHOW_SHOP, value: false});
    }
    
    const getRoomDetails = async () => { 
      console.log("fetching room details");
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
    
          setAllPlayers(updatePlayerDetails(players));
          setSessionId(data.session_id);
          setCurrentTurn(data.current_turn);
    
          setSelectedTemplate(data.template_name);
    
          setCard1Pos(data.card_type1_pos);
          setCard2Pos(data.card_type2_pos);
          setCard3Pos(data.card_type3_pos);
          setCard4Pos(data.card_type4_pos);
          setCard5Pos(data.card_type5_pos);
          setShopPos(data.shop_pos);

          setRoomId(data.id);
        }
      } catch (e) {
        console.log("error", e);
      }
    };
    
    const updatePlayerDetails = (players) => {
      const colors = ["red", "blue", "green", "yellow"];
      const updatedPlayers = players.map((player, index) => {
        const colorIndex = index % colors.length;
        const color = colors[colorIndex];
        return {...player, color};
      });
      return updatedPlayers;
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

        setShopImg(data.shop_image);
        
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
        setShopItemList(getRandomItemsFromList(items));
        
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
              await switchTurn();
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
      
      useEffect(() => {
        if (selectedTemplate) {
          getTemplateDetails();
        }
      }, [selectedTemplate]);
      
      useEffect(() => {
      }, [showModal]);



    const ShowLog = () => {
      console.log("showink lok");
      return (
        <div className="h-64 overflow-y-scroll bg-gradient-to-r from-gray-800 via-gray-900 to-black">
          <GetLog />
      </div>
      );
    }

    const GetLog = () => {
      return (
        <div>
          {log.reverse().map((entry, index) => (
            <div key={index} className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-2 rounded-lg border-2 border-gray-800 mb-2`}>
              <p className="text-gray-300">Time: {entry.logged_at}</p>
              <p className="text-gray-300">{entry.text}</p>
            </div>
          ))}
        </div>
      );
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
    
    const showShopItems = () => {

    }

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
  const rolling = useSelector((state) => state.global.isRolling, shallowEqual);
  const dispatch = useDispatch();

  const numberOfDots = useSelector((state) => state.global.numberRolled, shallowEqual);
  const firstRoll = useSelector((state) => state.global.firstRoll, shallowEqual);
  const secondRoll = useSelector((state) => state.global.secondRoll, shallowEqual);
  const hasRolls = useSelector((state) => state.global.hasRolls, shallowEqual);
  
  const rollDice = () => {
      if (rolling) return;
      dispatch({type: SET_IS_ROLLING, value: true});
      setTimeout(() => {
          dispatch({type: SET_IS_ROLLING, value: false});
          const newValue = Math.floor(Math.random() * 6) + 1;
          console.log(newValue);
          dispatch({type: SET_NUMBER_ROLLED, value: newValue});
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
  if (inventory.length == 0) {
    return <p className="text-gray-700">You have no items to display currently</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      {inventory.map((playerItem, index) => (
        <div key={playerItem.name}>
          <Item name={playerItem.name} price={playerItem.price} imageUrl={playerItem.image} />
        </div>
      ))}
    </div>
  );
};

const ShopItemList = () => {
  const buyItem = async (item) => {
    // Deduct the price of the item from the player's balance
    setBalance(balance - item.price);
    // Add the item to the player's inventory
    setInventory((inventory) => [...inventory, item]);

    const playerIndex = allPlayers.findIndex(player => player.session_id == sessionId);

    const newPlayer = {...allPlayers[playerIndex]};
    newPlayer.diff_items_amt += 1;
    newPlayer.balance = balance - item.price;
    
    const currentDate = new Date();
    const dateString = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const text = "Player has bought an item for price: " + item.price + ". ";
    await updateLog(dateString, text);

    await updatePlayer(newPlayer);
    resetStatesToDefault();
  };

  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      {shopItemList.map((shopItem, index) => (
        <div key={shopItem.name} className="flex flex-col items-center">
          <Item name={shopItem.name} price={shopItem.price} imageUrl={shopItem.image} />
          {shopItem.price <= balance ? (
            <button
              className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => buyItem(shopItem)}>
              Buy
            </button>
          ) : (
            <p className="mt-2 text-sm font-medium text-red-500">Not enough money</p>
          )}
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
    const currentIndex = allPlayers.findIndex(player => player.session_id === currentTurn);

    // Calculate the index of the next player
    const nextIndex = (currentIndex + 1) % allPlayers.length;

    // Set the CurrentTurn to the sessionId of the next player
    const nextPlayer = allPlayers[nextIndex];
    const nextTurn = nextPlayer.session_id;

    console.log("next turn", nextTurn);

    const currentDate = new Date();
    const dateString = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const text = "Switching turn to next player.";
    await updateLog(dateString, text);

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
      console.log("Turn updated successfully.");
  }) // log data
  .catch((error) => console.error(error));
}

const updatePlayer = async (player) => {
  
  console.log("updating player", player);
      const requestOptions = {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken, // include the CSRF token in the headers
        },
        body: JSON.stringify(
            {
              session_id: player.session_id,
              diff_items_amt: player.diff_items_amt              ,
              inventory_value: player.inventory_value,
              balance: player.balance,
              position: player.position,
              rounds_frozen: player.rounds_frozen,
            }
        ),
    }
    fetch("/api/update-player", requestOptions)
    .then((response) => { 
        return response.json();
    }
        ) // take response and convert it to json obj
    .then((data) => { 
        console.log("Player updated successfully.");
        console.log(data);
        setBalance(player.balance);
        console.log("new balance set to", player.balance);
    }) // log data
    .catch((error) => console.error(error));
}

const updatePlayersData = () => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      code: roomCode,
    }),
  };

  fetch('/api/get-room-players', requestOptions)
    .then(response => response.json())
    .then(data => {
      setAllPlayers(updatePlayerDetails(data.players));
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};

const updateLog = async (time, text) => {
      const requestOptions = {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken, // include the CSRF token in the headers
        },
        body: JSON.stringify(
            {
              room_code: roomCode,
              logged_at: time,
              text: text,
            }
        ),
    }
    fetch("/api/update-log", requestOptions)
    .then((response) => { 
        return response.json();
    }
        ) // take response and convert it to json obj
    .then((data) => { 
        console.log("Log updated successfully.");
        console.log(data);
    }) // log data
    .catch((error) => console.error(error));
}

const getLogData = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 
          "Content-Type": "application/json",
          'X-CSRFToken': csrftoken, // include the CSRF token in the headers
      },
      body: JSON.stringify(
          {
            room_code: roomCode,
          }
      ),
  }
  fetch("/api/get-log", requestOptions)
  .then((response) => { 
      return response.json();
  }
      ) // take response and convert it to json obj
  .then((data) => { 
      console.log("Log data:");
      const items = data.map((item) => {
        return new LogItem(
          item.logged_at,
          item.text,
        );
      });
      console.log("logs", items);
      setLog(items);
  }) // log data
  .catch((error) => console.error(error));
}

const updateTurn = async () => { 
  if (!roomCode) {
    return;
  }
  try {
    const response = await fetch(`/api/get-room?code=${roomCode}`, { credentials: 'include' });
    if (!response.ok) {
      navigate("/");
    } else {
      const data = await response.json();
      setCurrentTurn(data.current_turn);
    }
  } catch (e) {
    console.log("error", e);
  }
};

useEffect(() => {
  console.log("has? ", hasRolls);
  const interval = setInterval(() => {
    if (!rolling) { // todo shop
      updatePlayersData();
      updateTurn();
      getLogData();
    }
  }, 1000);
  return () => clearInterval(interval);
}, []);


const resetStatesToDefault = () => {
  console.log("reseting data to default.");
  // dispatch({type: SET_NUMBER_ROLLED, value: 1}); // causes to rerender the dice and sets the number to 1.
  dispatch({type: SET_HAS_ROLLS, value: true});
  dispatch({type: SET_FIRST_ROLL, value: true});
  dispatch({type: SET_SECOND_ROLL, value: true});
}


const handleNoRolls = () => {
  if (!hasRolls) {
    const amtToMove = !secondRoll ? 6 + numberRolled : numberRolled;
    handleNewPosition(amtToMove);
  }
}

const handleNewPosition = async (amtToMove) => {
  const playerIndex = allPlayers.findIndex(player => player.session_id == sessionId);

  const newPlayer = {...allPlayers[playerIndex]};

  const currentDate = new Date();
  const dateString = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const playerPrefix = "player with color " + newPlayer.color;

  const playersRolls = playerPrefix + " has rolled " + amtToMove;
  updateLog(dateString, playersRolls);

  if (newPlayer.rounds_frozen > 0) {
    newPlayer.rounds_frozen -= 1;
    
    const text = playerPrefix + "is frozen, switching turn.";
    await updateLog(dateString, text);

    switchTurn();
    await updatePlayer(newPlayer);
    resetStatesToDefault();
    console.log("player was frozen, dec. rounds fr");
    return;
  }

  const newPos = newPlayer.position + amtToMove; // this number overflows the amt of fields, handeled separately in next methods

  if (newPos >= numFields) {
    console.log("passed round");

    const newRound = "Player has passed the round, incrementing balance with amount " + reward;
    await updateLog(dateString, newRound);

    incrementPlayersBalance(newPlayer, reward);
  }

  handleCards(newPlayer, newPos);

}


// reusable for cards as well as the round end
const incrementPlayersBalance = (player, amt) => {
  console.log(player.balance, amt, "player bal and amt");
  player.balance += parseInt(amt);
  console.log("Balance incremented with amount: ", amt);
}

const decrementPlayersBalance = (player, amt) => {
  console.log(player.balance, amt, "player bal and amt dec");
  const newBal = player.balance - amt;
  if (newBal < 0) {
    player.balance = 0;
  } else {
    player.balance = parseInt(newBal);
  }
  console.log("bal decremented");
}

const handleCards = async (player, position) => {
  console.log("position: ", position);

  const currentDate = new Date();
  const dateString = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const playerPrefix = "player with color " + player.color;

  if (card1pos == position) { // ok working
    const amtToMove = generateCard1Rule();
    const posToMove = (position + amtToMove);
    const newPos = posToMove % numFields;

    const card1Passed = playerPrefix + " landed on a special field. He's being moved additionally + " + amtToMove;
    await updateLog(dateString, card1Passed);

    console.log("nes pos", newPos);
    if (posToMove >= numFields) {
      const newRound = "Player has passed the round, incrementing balance with amount " + reward;
      await updateLog(dateString, newRound);
      
      incrementPlayersBalance(player, reward);
    }
    player.position = newPos;
  } else if (card2pos == position) {
    const amtToMove = generateCard2Rule();
    const newPos = (position + amtToMove) % numFields;

    const card2Passed = playerPrefix + " landed on a special field. He's being moved backwards + " + amtToMove;
    await updateLog(dateString, card2Passed);

    player.position = newPos;
  } else if (card3pos != null && card3pos == position) { // reset to start, TODO check whether it is set or not.
    const card3Passed = playerPrefix + " landed on a special field. Reseting to start.";
    await updateLog(dateString, card3Passed);

    player.position = 0;
  } else if (card4pos == position) {
    player.rounds_frozen = card4RoundsStop; // todo doriesit

    const card4Passed = playerPrefix + " is being frozen for " + card4RoundsStop + " rounds.";
    await updateLog(dateString, card4Passed);

    player.position = position % numFields;
  } else if (card5pos == position) {
    const ballChange = generateCard5Balance(card5Min, card5Max);
    if (ballChange > 0) {
      incrementPlayersBalance(player, ballChange);
    } else {
      decrementPlayersBalance(player, ballChange);
    }

    const card5Passed = playerPrefix + " balance is being changed due to special field with amount " + ballChange;
    await updateLog(dateString, card5Passed);

    player.position = position % numFields;
  } else if (shopPos == position) {
    console.log("SHOWING SHOP");
    const shopPassed = playerPrefix + " has entered the shop.";
    await updateLog(dateString, shopPassed);

    player.position = position % numFields;
    await showShopInventory();

    // todo await close
  } else { // normal field without any "card"
    player.position = position % numFields;
    console.log("normal pos");
    const currentDate = new Date();
    const dateString = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const text = "player with color " + player.color + " has rolled " + numberRolled;
    await updateLog(dateString, text);
  }


  switchTurn();
  await updatePlayer(player);
  resetStatesToDefault();
  console.log("new player position to be set and turn switched", position);
}

const generateCard1Rule = () => {
  const range = card1Max - card1Min;
  const randomNumber = (Math.random() * range) + card1Min;
  return Math.round(randomNumber);
}

const generateCard2Rule = () => {
  const range = card2Max - card2Min;
  const randomNumber = (Math.random() * range) + card2Min;
  return Math.round(randomNumber);
}

const generateCard5Balance = (number1, number2) => {
  const randomNumber = Math.round(Math.random() * (number2 - number1) + number1);
  const randomSign = Math.random() < 0.5 ? -1 : 1;
  const finalNumber = randomNumber * randomSign;
  return finalNumber;
}

// todo fix items
const getRandomItemsFromList = (items) => {
  console.log("EE", items);
  if (items.length > 0) {
    const playerItems = items.map((shopItem) => {
      const randomPrice = Math.floor(Math.random() * (shopItem.price_max - shopItem.price + 1)) + shopItem.price;
      return new PlayerItem(shopItem.name, shopItem.image, randomPrice);
    });
    console.log("p it", playerItems);
    return playerItems;
  }
  return [];
}

// TODO pass player here as param
const generateShopItemsModal = () => {
  console.log("showing SHOP");

  if (shopItemList.length == 0) {
    return;
  }

// todo

  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto ${showShopModal ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg" style={{marginTop: '15vh'}}>
          <div className="bg-gradient-to-r from-gray-500 to-white p-4">
            <div className="pb-4 sm:pb-6">
              <h2 className="text-xl font-bold text-gray-900">{shopName}</h2>
            </div>
            <div className="pt-4 sm:pt-6">
              {/* <p className="text-gray-700">You have no items to display currently</p> */}
              <ShopItemList/>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-500 to-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={hideShopInventory}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

useEffect(() => {
  console.log("has no rolls left");
  if (currentTurn == sessionId) {
    if (shopItems.length > 0) { // initializes the list whenever the turn changes for the player
      console.log("been here once");
      getRandomItemsFromList(shopItems);
    }
    handleNoRolls();
  }
}, [hasRolls]);


    return (
      <div className={"flex flex-row min-h-screen w-screen bg-gradient-to-br from-sky-900 via-violet-600 to-amber-200"}>
        <ShowTopDetails/>
        <ShowBottomDetails/>

        {showModal ? showInventory() : null}

        {showShopModal ? generateShopItemsModal() : null}

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
        </div>
    
        

        <div className="w-2/5 p-4 mt-16">
          <div className="flex flex-wrap -mx-4">
            {allPlayers.map((player) => (
              <div className="w-1/2 px-4 mb-4">
                <div className={`bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-2 rounded-lg ${currentTurn === player.session_id ? 'border-2 border-gradient-to-r from-red-400 to-yellow-500' : 'border-2 border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">{player.player_name}</h2>
                  <div className="inline-block ml-2"><Figurine color={player.color} /></div>
                </div>
                  <p className="text-gray-300">Balance: {player.balance}</p>
                  <p className="text-gray-300">Inventory Value: {player.inventory_value}</p>
                  <p className="text-gray-300">Different items: {player.diff_items_amt}</p>
              </div>

              </div>
            ))}
            <Dice />
            <ShowLog />

          </div>
        </div>


      </div>
    );
    
}
