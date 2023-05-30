import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid} from "@mui/material";
// import getCookie from "./CreateRoom"
import { useNavigate} from 'react-router-dom';
import {useSelector, shallowEqual} from "react-redux"; 
import InvalidOperation from './InvalidOperation';


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

export default function CreateTemplate(props) { // todo add props as in CreateRoom
    const [isLoggedIn, entered, name] = useSelector((state) => [state.global.isLoggedIn, state.global.entered, state.global.name], shallowEqual);
    console.log(isLoggedIn, " ", name);
    const csrftoken = getCookie('csrftoken');

    const [balance, setBalance] = useState(1000);
    const [templateName, setTemplateName] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopImage, setShopImage] = useState(null);
    // cards
    const [card1Image, setCard1Image] = useState(null);
    const [card1Rule, setCard1Rule] = useState(1);
    const [card1Max, setCard1Max] = useState(2);

    const [card2Image, setCard2Image] = useState(null);
    const [card2Rule, setCard2Rule] = useState(1);
    const [card2Max, setCard2Max] = useState(2);

    const [card3Image, setCard3Image] = useState(null);
    const [card3Rule, setCard3Rule] = useState(false);

    const [card4Image, setCard4Image] = useState(null);
    const [card4Rule, setCard4Rule] = useState(1);

    const [card5Image, setCard5Image] = useState(null);
    const [card5Rule, setCard5Rule] = useState(1);
    const [card5Max, setCard5Max] = useState(2);

    const [win1, setWin1] = useState(true);
    const [win2, setWin2] = useState(false);
    const [winAmt, setWinAmt] = useState(3);

    const [numFields, setNumFields] = useState(24);

    const [reward, setReward] = useState(1000);

    const navigate = useNavigate();

    useEffect(() => {
      }, [card1Rule, card1Max ,card2Rule, card2Max, card5Rule, card5Max]);

    const handleBalanceChange  = (e) => {
        setBalance(parseInt(e.target.value));
    };

    const handleReward  = (e) => {
        setReward(parseInt(e.target.value));
    };

    const handleNumberOfFields  = (e) => {
        setNumFields(parseInt(e.target.value));
    };

    const handleTemplateNameChange  = (e) => {
        setTemplateName(e.target.value);
    };

    // shop
    const handleShopNameChange  = (e) => {
        setShopName(e.target.value);
    };

    const handleSelection = (e) => { 
        const selectedValue = e.target.value;
        if (selectedValue == 'first') {
            setWin1(true);
            setWin2(false);
            return;
        }
        if (selectedValue == 'second') {
            console.log(selectedValue);
            setWin1(false);
            setWin2(true);
        }
    };

    const handleImageChange = (e, setter) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile)
        if (selectedFile) {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onloadend = () => {
            setter(reader.result);
          };
        }
      };

    const handleCard1RuleChange  = (e) => {
        setCard1Rule(parseInt(e.target.value));
    };

    const handleCard1RuleMaxChange = (e) => {
        setCard1Max(parseInt(e.target.value));
    };

    const handleCard2RuleChange  = (e) => {
        setCard2Rule(parseInt(e.target.value));
    };

    const handleCard2RuleMaxChange = (e) => {
        setCard2Max(parseInt(e.target.value));
    };

    const handleCard4RuleChange  = (e) => {
        setCard4Rule(parseInt(e.target.value));
    };

    const handleCard5RuleChange  = (e) => {
        setCard5Rule(parseInt(e.target.value));
    };

    const handleCard5RuleMaxChange = (e) => {
        setCard5Max(parseInt(e.target.value));
    };


    const handleCard3RuleChange = (e) => {
      setCard3Rule(e.target.checked);
    };

    const handleWinAmt = (e) => {
        setWinAmt(parseInt(e.target.value));
    }

    // TEMPLATE CREATION:
    const handleCreateTemplate = async () => {
        console.log("My csrf token: ", csrftoken);
        console.log("card image: ", card1Image);
        console.log("card image from list: ", card1Image);
        const uploadData = new FormData();
        uploadData.append('name', templateName);
        uploadData.append('start_balance', balance);
        uploadData.append('card_type1_image', card1Image);
        uploadData.append('card_type1_mvup', card1Rule);
        uploadData.append('card_type1_mvup_max', card1Max);
        uploadData.append('card_type2_image', card2Image);
        uploadData.append('card_type2_mvdown', card2Rule);
        uploadData.append('card_type2_mvdown_max', card2Max);
        uploadData.append('card_type3_image', card3Image);
        uploadData.append('card_type3_reset', card3Rule);
        uploadData.append('card_type4_image', card4Image);
        uploadData.append('card_type4_round_stop', card4Rule);
        uploadData.append('card_type5_image', card5Image);
        uploadData.append('card_type5_min', card5Rule);
        uploadData.append('card_type5_max', card5Max);
        uploadData.append('shop_name', shopName);
        uploadData.append('shop_image', shopImage);
        uploadData.append('reward_per_round', reward);
        uploadData.append('number_of_rounds', numFields);
        uploadData.append('winning_pos1', win1);
        uploadData.append('winning_pos2', win2);
        uploadData.append('winning_amt', winAmt);
        uploadData.append('author', name);
        // uploadData.append('shop_items', []); // add an empty list for shop_items since they are gonna be added on next page.
        
        fetch("/api/create-template", {
            method: 'POST',
            headers: { 
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: uploadData
        })
        .then((response) => { 
            return response.json();
        })
        .then((data) => { 
            console.log("Response data: ", data);
            console.log("Navigating to: /template/", data.name);
            navigate(`/template/${data.name}`);
        })
        .catch((error) => {
            console.log("ERROR");
            console.error(error);
        });
    };

    const loadPage = () => {

    return (
        <form
        enctype="multipart/form-data"
        onSubmit={(e) => {e.preventDefault();}}
         className='flex flex-col flex-wrap gap-4'>
          {/* Header */}
            <div className='flex justify-center'> 
                <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                    Create a Template
                </h1>
            </div>

          <div className='flex flex-row gap-4'>            
                        {/* Inner content for the input data of */}
                <div className='flex flex-col gap-4'>
                    <label for="template-text" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                        Template name
                    </label>
                    <input type="text" 
                            id="template-text" 
                            onChange={handleTemplateNameChange}
                            aria-describedby="helper-text-explanation"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter the template name."
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label for="shop-name" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                        Shop-Name
                    </label>
                    <input type="text" 
                            id="shop-name" 
                            aria-describedby="helper-text-explanation"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Enter the shop name."
                            onChange={handleShopNameChange}
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                           for="shop_image">Upload shop image</label>
                    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                           id="shop_image" 
                           type="file"
                           onChange={(e) => handleImageChange(e, setShopImage)}
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label for="start-balance" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                        Starting balance
                    </label>
                    <input type="number" 
                            min={1000}
                            id="start-balance" 
                            onChange={handleBalanceChange}
                            aria-describedby="helper-text-explanation"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Min. 1000"
                    />
                </div>
        </div>
        <div className='flex flex-row gap-4'>
            <div className='flex flex-col gap-4'>
                <label for="round-reward" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                    Reward per round
                </label>
                <input type="number" 
                        id="round-reward" 
                        onChange={handleReward}
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Min. 500"
                        min={500}
                />
            </div>

            <div className='flex flex-col gap-4'>
                <label for="round-amt" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                    Number of Fields
                </label>
                <input type="number"  
                        id="round-amt" 
                        onChange={handleNumberOfFields}
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={24}
                        max={40}
                        step={4}
                        style={{width: '185px'}}
                        placeholder="Min. 24, max 40"
                />
            </div>

            <div className='flex flex-col gap-4'>     
                <label for="strategy" 
                    class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Choose a win strategy</label>
                <select id="strategy" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={handleSelection}
                        >
                    <option selected value="first">Number of items</option>
                    <option value="second">Inventory value </option>
                </select>
            </div>

            <div className='flex flex-col gap-4'>
                <label for="win-goal" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                    Winning goal
                </label>
                <input type="number"  
                        id="win-goal" 
                        onChange={handleWinAmt}
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        placeholder="Set win amount"
                        />
            </div>
        </div>
        {/* card 1: */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card1-rule" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Move forward field Min
                </label>
                <input type="number" 
                        id="card1-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        max={card1Max - 1}
                        style={{width: '185px'}}
                        placeholder="Set num of spaces to move fwd"
                        onChange={handleCard1RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label for="card1-max" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Move forward field Max
                </label>
                <input type="number" 
                        id="card1-max" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={card1Rule + 1}
                        placeholder="Set num of spaces to move fwd"
                        onChange={handleCard1RuleMaxChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card1-image">Move forward field image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card1-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard1Image)}
                       />
            </div>
        </div>

        {/* card 2 */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card2-rule" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Move backwards field Min
                </label>
                <input type="number" 
                        id="card2-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        max={card2Max - 1}
                        style={{width: '185px'}}
                        placeholder="Set num of spaces to move bwd"
                        onChange={handleCard2RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label for="card2-max" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Move backwards field Max
                </label>
                <input type="number" 
                        id="card2-max" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={card2Rule + 1}
                        placeholder="Set num of spaces to move fwd"
                        onChange={handleCard2RuleMaxChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card2-image">Move backwards field image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card2-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard2Image)}
                       />
            </div>
        </div>
        {/* Card 3 */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card3-rule" 
                    class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                    Reset to start field
                </label>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                        id="card3-rule" 
                        value="" 
                        class="sr-only peer"
                        onChange={handleCard3RuleChange}
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Enable reset to start
                    </span>
                </label>
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card3-image">Reset to start field image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card3-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard3Image)}
                       />
            </div>
        </div>
          {/* card 4 */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card4-rule" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Rounds stop field
                </label>
                <input type="number" 
                        id="card4-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        placeholder="Set stop rounds."
                        onChange={handleCard4RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card4-image">Upload Rounds stop field image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card4-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard4Image)}
                       />
            </div>
        </div>      

        {/* card 5 */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card5-rule" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Win/Lose money field Min
                </label>
                <input type="number" 
                        id="card5-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        max={card5Max - 1}
                        style={{width: '185px'}}
                        placeholder="Min. Amount to win or lose"
                        onChange={handleCard5RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label for="card5-max" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Win/Lose money field Max
                </label>
                <input type="number" 
                        id="card5-max" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={card5Rule + 1}
                        placeholder="Max. Amount to win or lose"
                        onChange={handleCard5RuleMaxChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card5-image">Upload Win/Lose money field image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card5-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard5Image)}
                       />
            </div>
        </div>        

                        {/* BUTTONS */}
        <div className='flex flex-row gap-4 justify-center'>            
            <div className='flex flex-col flex-wrap gap-4'>     
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleCreateTemplate()}
                        sx={{
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                            '&:hover': {
                            backgroundColor: '#07da63',
                            },
                        }}
                        >
                        CREATE A TEMPLATE
                    </Button>
                </Grid>
            </div>
            <div className='flex flex-col flex-wrap gap-4'>     
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
                        CANCEL
                    </Button>
                </Grid>
            </div>
            </div>
        </form>
    );
};

return (
    isLoggedIn ? loadPage() : InvalidOperation()
);
}