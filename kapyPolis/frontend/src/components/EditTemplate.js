import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid} from "@mui/material";
import {useSelector, shallowEqual} from "react-redux"; 
import InvalidOperation from './InvalidOperation'


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

function hideDefaultOption() {
    const defaultOption = document.querySelector('#strategy option[value=""]');
    defaultOption.style.display = 'none';
}

export default function EditTemplate() {
// todo check first selection
    const [isLoggedIn, name] = useSelector((state) => [state.global.isLoggedIn, state.global.name], shallowEqual);
    const [templateNames, setTemplateNames] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("")
    const [firstSelection, setFirstSelection] = useState(false);
    const [error, setError] = useState(false);
    const [selectedName, setSelectedName] = useState(null);

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
    const [firstName, setFirstName] = useState("");

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


    const handleSelection = (e) => { 
        const selectedValue = e.target.value;
        setSelectedTemplate(selectedValue);
        console.log("temp selected", selectedValue); 
      };

      const handleSelectionGame = (e) => { 
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

      useEffect(() => {
        getTemplateNames();
      }, []);

      const getTemplateNames  = async () => {
        if (name == null) {
            setError(true);
            return;
        }
        fetch(`/api/get-author-templates?author=${name}`, { credentials: 'include' }) // include headers

        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            if (!response.ok) {
              setError(true);
            } else {
              return response.json();
            }
        })
        .then((data) => {
            setTemplateNames(data.template_names); // Extract names from data and store in an array
            if (data.template_names.length > 0 && !firstSelection) {
              setSelectedTemplate(data.template_names[0]);
              setFirstSelection(true);
            }
        })
        .catch((error) => {
            console.log("e");
            console.log(error)
        })
      } 

      useEffect(() => {
    }, [selectedTemplate, firstSelection]);

    const getBackButton = () => {
        return (
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
                    BACK
                </Button>
            </Grid>
        </div>
        );
    } 

    const getSelection = () => {
        return (
            <div className='flex flex-row justify-center'>  
            <div className='flex flex-col gap-4'>
              <label for="strategy" 
                   class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Choose a template</label>
              <select id="strategy" 
                      class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                      onChange={handleSelection}
                      >
                  {templateNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            </div> 
          </div> 
        );
    }

    const getEditTemplate = () => {
        return (
            <form
            enctype="multipart/form-data"
            onSubmit={(e) => {e.preventDefault();}}
             className='flex flex-col flex-wrap gap-4'>
              {/* Header */}
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
                            placeholder="Min. 24, max. 40"
                    />
                </div>

                <div className='flex flex-col gap-4'>     
                    <label for="strategy" 
                        class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Choose a win strategy</label>
                    <select id="strategy" 
                            class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={handleSelectionGame}
                            onClick={hideDefaultOption}
                            >
                        <option value="" disabled selected>Select value</option>      
                        <option value="first">Number of diff cards</option>
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
                            style={{width: '185px'}}
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
                        Move forward card Min
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
                        Move forward card Max
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
                       for="card1-image">Upload Move forward card image</label>
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
                        Move backwards card Min
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
                        Move backwards card Max
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
                       for="card2-image">Move backwards card image</label>
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
                        Reset to start card
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
                       for="card3-image">Upload Reset to start card image</label>
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
                        Rounds stop card
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
                       for="card4-image">Rounds stop card image</label>
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
                        Win/Lose money card Min
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
                        Win/Lose money card Max
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
                       for="card5-image">Upload Win/Lose money card image</label>
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
                            onClick={() => handleTemplateUpdate()}
                            sx={{
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                '&:hover': {
                                backgroundColor: '#07da63',
                                },
                            }}
                            >
                            UPDATE TEMPLATE
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
                            BACK
                        </Button>
                    </Grid>
                </div>
                </div>
            </form>
        );
    }

    const editTemplate = async () => {
        // TODO REUSE CREATETEMPLATE
        setSelectedName(selectedTemplate);
        console.log(selectedName);
        fillTemplateData();
    }

    const fillTemplateData = () => {

        fetch(`/api/get-template?name=${selectedTemplate}`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
              return response.json();
        })
        .then((data) => {
        console.log("data", data);
        setBalance(data.start_balance);
        setTemplateName(data.name);
        setFirstName(data.name);
        setShopName(data.shop_name);

        // cards
        setCard1Rule(data.card_type1_mvup);
        setCard1Max(data.card_type1_mvup_max);

        setCard2Rule(data.card_type2_mvdown);
        setCard2Max(data.card_type2_mvdown_max);

        setCard3Rule(data.card_type3_reset);

        setCard4Rule(data.card_type4_round_stop);

        setCard5Rule(data.card_type5_min);
        setCard5Max(data.card_type5_max);
        
        console.log("win1, win2", data.winning_pos1, data.winning_pos2);
        setWin1(data.winning_pos1);
        setWin2(data.winning_pos2);
        setWinAmt(data.winning_amt);

        setNumFields(data.number_of_rounds);
        setReward(data.reward_per_round);

        })
        .catch((e) => {
            console.log("e");
        })
    }

    const handleTemplateUpdate = () => {
        const uploadData = new FormData();
        uploadData.append('name', firstName);
        uploadData.append('start_balance', balance);
        uploadData.append('card_type1_mvup', card1Rule);
        uploadData.append('card_type1_mvup_max', card1Max);
        uploadData.append('card_type2_mvdown', card2Rule);
        uploadData.append('card_type2_mvdown_max', card2Max);
        uploadData.append('card_type3_reset', card3Rule);
        uploadData.append('card_type4_round_stop', card4Rule);
        uploadData.append('card_type5_min', card5Rule);
        uploadData.append('card_type5_max', card5Max);
        uploadData.append('shop_name', shopName);
        uploadData.append('reward_per_round', reward);
        uploadData.append('number_of_rounds', numFields);
        uploadData.append('winning_pos1', win1);
        uploadData.append('winning_pos2', win2);
        uploadData.append('winning_amt', winAmt);
        uploadData.append('author', name);
        uploadData.append('new_name', templateName);
        if (shopImage != null) {
            uploadData.append('shop_image', shopImage);
        }

        if (card1Image != null) {
            uploadData.append('card_type1_image', card1Image);
        }
        if (card2Image != null) {
            uploadData.append('card_type2_image', card2Image);
        }
        if (card3Image != null) {
            uploadData.append('card_type3_image', card3Image);
        }
        if (card4Image != null) {
            uploadData.append('card_type4_image', card4Image);
        }
        if (card5Image != null) {
            uploadData.append('card_type5_image', card5Image);
        }

        const requestOptions = {
            method: 'POST',
            headers: { 
                // "Content-Type": "multipart/form-data",
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: uploadData
        }
        fetch("/api/update-template", requestOptions)
        .then((response) => { 
            if (response.ok) {
                console.log("updated")
                navigate(`/template/${templateName}`);
            } else {
                console.log("some error");
            }
        })
        .catch((error) => {
            console.error(error) 
        });
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

    const showheading = () => {
        return (
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                Edit a Template
            </h1>
        </div>
        );
    }

    const getSelectTemplateButton = () => {
        return (
            <div className='flex flex-row justify-center'>  
                <div className='flex flex-col gap-4'>
                    <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => editTemplate()}
                        sx={{
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                            '&:hover': {
                            backgroundColor: '#07da63',
                            },
                        }}
                        >
                        EDIT TEMPLATE
                    </Button>
                </Grid>
            </div>
        </div>
        );
    }

    return (
        <div>
        {!isLoggedIn? InvalidOperation() : null}
        {isLoggedIn ? showheading() : null}
        {(isLoggedIn && selectedName == null) ? getSelection() : null }

        {/* edit template button 1 - as a selection */}
        {(isLoggedIn && selectedName == null) ? getSelectTemplateButton() : null} 

        {/* edit form - fullfill data */}
        {(isLoggedIn && selectedName != null) ? getEditTemplate() : null}

        {(isLoggedIn && selectedName == null) ? getBackButton() : null}
      </div>
    );
}