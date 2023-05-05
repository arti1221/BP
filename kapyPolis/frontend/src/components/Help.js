import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid} from "@mui/material";

export default function Help() { // todo add props as in CreateRoom

    // constantes
    const [labelToShow, setLabelToShow] = useState("Help Menu");
    const [winStrat1] = useState("Number of different cards");
    const [winStrat2] = useState("Inventory value");
    const [reset] = useState("User resets on start");
    const [notReset] = useState("Free card");
    // help
    const [gameHelpPressed, setGameHelpPressed] = useState(false);
    const [templateHelpPressed, setTemplateHelpPressed] = useState(false);

    const [templateNames, setTemplateNames] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("")
    const [firstSelection, setFirstSelection] = useState(false);

    const [loadNextComponent, setLoadNextComponent] = useState(false);
    const [showTempDetails, setShowTempDetails] = useState(false);

    // template data
    const [balance, setBalance] = useState(1000);
    const [templateName, setTemplateName] = useState("");
    const [shopName, setShopName] = useState("");

    // cards
    const [card1Rule, setCard1Rule] = useState(1);
    const [card1Max, setCard1Max] = useState(2);

    const [card2Rule, setCard2Rule] = useState(1);
    const [card2Max, setCard2Max] = useState(2);

    const [card3Rule, setCard3Rule] = useState(false);

    const [card4Rule, setCard4Rule] = useState(1);

    const [card5Rule, setCard5Rule] = useState(1);
    const [card5Max, setCard5Max] = useState(2);

    const [win1, setWin1] = useState(true);
    const [win2, setWin2] = useState(false);
    const [winAmt, setWinAmt] = useState(3);

    const [numFields, setNumFields] = useState(24);

    const [reward, setReward] = useState(1000);
    const [author, setAuthor] = useState("");

    const getTemplateNames  = () => {
        fetch(`/api/get-all-templates`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
            if (!response.ok) {
              navigate("/");
            } else {
              return response.json();
            }
        })
        .then((data) => {
            setTemplateNames(data.template_names); // Extract names from data and store in an array
            if (data.template_names.length > 0 && !firstSelection) {
              console.log("first template", data.template_names[0]);
              setSelectedTemplate(data.template_names[0]);
              setFirstSelection(true);
            }
        })
        .catch((error) => {
            console.log("e");
            console.log(error)
        })
      };

      const handleSelection = (e) => { 
        const selectedValue = e.target.value;
        setSelectedTemplate(selectedValue);
        console.log("temp selected", selectedValue); 
      };
  
      const showSelection = () => {
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
      };

      useEffect(() => {
        getTemplateNames();
      }, []);

      useEffect(() => {
      }, [gameHelpPressed, templateHelpPressed, labelToShow]);

    const getBackButton = () => {
        return (
            <div className='flex flex-row gap-4 justify-center'>
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
                        BACK TO MENU
                    </Button>
                </Grid>
            </div>
        </div>
        );
    };

    const handleGameHelpPressed = () => {
        setLabelToShow("Game Help");
        setGameHelpPressed(true);
        setLoadNextComponent(true);
    }

    const showGameHelp = () => {
        return (
            <div class="grid grid-cols-4 grid-rows-5 gap-4 place-items-center">
                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300  inline-block text-center">
                        Template author:
                    </span>
                </div>

                <div class="flex flex-col items-center">
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Author of the template. The only person that can update it after creation.
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Move forward card:
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        The range of fields the player would be moved forwards. The exact number will be picked randomly in defined range. 
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Starting balance: 
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Balance each user starts with on game beginning.
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Move backwards card:
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                    Defines the range of fields the player would be moved backwards. The exact number will be picked randomly in defined range. 
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Rewards: 
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Amount of money that will be added to players balance when he passes the round.
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Reset to start card:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Defines whether the player gets restarted to start or continues without any changes (free card).
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Shop Name:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Name of the shop that will be displayed when player enters it. Shop will contain predefined items with price ranges and image.
                    </span>
                </div>
                
                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Rounds stop card:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Amount of rounds the player can not move.
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Winning strategy:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Rule for winning the game. It either can be inventory value or any amount of different items the player has to buy.
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Win/Lose money card:
                    </span>
                </div>

                <div>                        
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                            Predefines range of money the player gets as reward or has to pay.
                    </span>    
                </div>

                <div>                        
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Number of Fields:
                    </span>   
                </div>

                <div>                        
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        Amound of fields of the game.
                    </span>
                </div>
            </div>
        );
    };


    const handleTemplateHelpPressed = () => {
        setLabelToShow("Template Help");
        setTemplateHelpPressed(true);
        setLoadNextComponent(true);
    };

    const showGameHelpButton = () => {
        return (
            <div className='flex flex-row justify-center'>  
                <div className='flex flex-col gap-4'>
                    <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleGameHelpPressed()}
                        sx={{
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                            '&:hover': {
                            backgroundColor: '#07da63',
                            },
                        }}
                        >
                        SHOW GAME HELP
                    </Button>
                </Grid>
            </div>
        </div>
        );
    };

    const showTemplateDetailsButton = () => {
        return (
                <div className='flex flex-row justify-center'>  
                    <div className='flex flex-col gap-4'>
                        <Grid item xs={12} align="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleTemplateHelpPressed()}
                            sx={{
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                '&:hover': {
                                backgroundColor: '#07da63',
                                },
                            }}
                            >
                            SHOW TEMPLATE HELP
                        </Button>
                    </Grid>
                </div>
            </div>
        );
    };

    const showTemplateDetails = () => {
        return (
            <div>
                <div className='flex flex-row justify-center'>  
                    <div className='flex flex-col gap-4'>
                        <Grid item xs={12} align="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => showTemplateDetailsSpecs()}
                            sx={{
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                '&:hover': {
                                backgroundColor: '#07da63',
                                },
                            }}
                            >
                            SHOW DETAILS
                        </Button>
                    </Grid>
                </div>
            </div>
            </div>
        );
    };

    const getTemplateDetails = () => {
        console.log("Fetching details for template: ", selectedTemplate);
        // todo fetch
        fetch(`/api/get-template?name=${selectedTemplate}`, { credentials: 'include' }) // include headers
        .then((response) => {
            // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
              return response.json();
        })
        .then((data) => {
            console.log("data", data)
            setBalance(data.start_balance);
            setTemplateName(data.name);
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
            setAuthor(data.author);
            console.log("a", author, data.author);
        })
        .catch((e) => {
            console.log("eror while fetching data for template", selectedTemplate);
            console.log(e);
        })
    }

    const showTemplateDetailsSpecs = () => {
        getTemplateDetails();
        setShowTempDetails(true);
        setLabelToShow("Template Details: " + selectedTemplate);
        console.log("TD", selectedTemplate);
    }

    

    const showTemplateData = () => {
        return (
            <div class="grid grid-cols-4 grid-rows-5 gap-4 place-items-center">
                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Template author:
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                            {author}
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Move forward card settings:
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {card2Rule} - {card2Max}
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Starting balance: 
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {balance}
                    </span>
                </div>

                <div>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Move backwards card settings: 
                    </span>
                </div>

                <div>
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {card2Rule} - {card2Max}
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Rewards per round: 
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {reward}
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Reset to start card settings:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {card3Rule ? reset : notReset}
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Shop Name:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {shopName}
                    </span>
                </div>
                
                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Rounds stop card settings:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {card4Rule}
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Winning strategy:
                    </span>
                </div>

                <div>                    
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {win1 ? winStrat1 : winStrat2} - {winAmt}
                    </span>
                </div>

                <div>                    
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Win/Lose money card settings:
                    </span>
                </div>

                <div>                        
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                            {card5Rule} - {card5Max}
                    </span>    
                </div>

                <div>                        
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block text-center">
                        Number of Rounds:
                    </span>   
                </div>

                <div>                        
                    <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 inline-block text-center">
                        {numFields}
                    </span>
                </div>
            </div>
        );
    };


        return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-center'> 
                <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                    {labelToShow}
                </h1>
            </div>
                {(!loadNextComponent) ? showGameHelpButton(): null}
                {(!loadNextComponent) ? showTemplateDetailsButton(): null}

                {gameHelpPressed ? showGameHelp() : null}

                {(templateHelpPressed && !showTempDetails) ? showSelection() : null}
                {(templateHelpPressed && !showTempDetails) ? showTemplateDetails() : null}
                {showTempDetails ? showTemplateData() : null}
                {getBackButton()}
        </div>
    );
}