import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid} from "@mui/material";
// import getCookie from "./CreateRoom"
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

export default function CreateTemplate() { // todo add props as in CreateRoom
    const csrftoken = getCookie('csrftoken');
    const [balance, setBalance] = useState(1000);
    const [templateName, setTemplateName] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopImage, setShopImage] = useState(null);
    // cards
    const [card1Image, setCard1Image] = useState(null);
    const [card1Rule, setCard1Rule] = useState(1);

    const [card3Image, setCard3Image] = useState(null);
    const [card3Rule, setCard3Rule] = useState(false);

    const [card2Image, setCard2Image] = useState(null);
    const [card2Rule, setCard2Rule] = useState(1);

    const [card4Image, setCard4Image] = useState(null);
    const [card4Rule, setCard4Rule] = useState(1);
    const navigate = useNavigate();

    const handleBalanceChange  = (e) => {
        setBalance(parseInt(e.target.value));
        console.log("Balance filled to: ", balance);
    };

    const handleTemplateNameChange  = (e) => {
        setTemplateName(e.target.value);
        console.log("Template name changed to: ", templateName);
    };

    // shop
    const handleShopNameChange  = (e) => {
        setShopName(e.target.value);
        console.log("Template name changed to: ", shopName);
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
        console.log("Card rule 1 changed to: ", card1Rule);
    };

    const handleCard2RuleChange  = (e) => {
        setCard2Rule(parseInt(e.target.value));
        console.log("Card rule 2 changed to: ", card2Rule);
    };

    const handleCard4RuleChange  = (e) => {
        setCard4Rule(parseInt(e.target.value));
        console.log("Card rule 3 changed to: ", card4Rule);
    };


    const handleCard3RuleChange = (e) => {
      setCard3Rule(e.target.checked);
    };

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
        uploadData.append('card_type2_image', card2Image);
        uploadData.append('card_type2_mvdown', card2Rule);
        uploadData.append('card_type3_image', card3Image);
        uploadData.append('card_type3_reset', card3Rule);
        uploadData.append('card_type4_image', card4Image);
        uploadData.append('card_type4_round_stop', card4Rule);
        uploadData.append('shop_name', shopName);
        uploadData.append('shop_image', shopImage);
        // uploadData.append('shop_items', []); // add an empty list for shop_items since they are gonna be added on next page.
        
        fetch("/api/create-template", {
            method: 'POST',
            headers: { 
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: uploadData
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    };


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
                            placeholder="Enter the template name with max length of 20 characters."
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
                            placeholder="Enter the shop name with max length of 20 characters."
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
                    <input type="text" 
                            id="start-balance" 
                            onChange={handleBalanceChange}
                            aria-describedby="helper-text-explanation"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Min. 1000"
                    />
                </div>
        </div>

        {/* card 1: */}
        <div className='flex flex-row gap-4'>  
            <div className='flex flex-col gap-4'>
                <label for="card1-rule" 
                       class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                       >
                    Card 1 Rule
                </label>
                <input type="number" 
                        id="card1-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        placeholder="Set num of spaces to move fwd"
                        onChange={handleCard1RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card1-image">Upload card 1 image</label>
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
                    Card 2 Rule
                </label>
                <input type="number" 
                        id="card2-rule" 
                        aria-describedby="helper-text-explanation"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        min={1}
                        placeholder="Set num of spaces to move bwd"
                        onChange={handleCard2RuleChange}
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card2-image">Upload card 2 image</label>
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
                    Card 3 Rule
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
                       for="card3-image">Upload card 3 image</label>
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
                    Card 4 Rule
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
                       for="card4-image">Upload card 4 image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card4-image" 
                       type="file"
                       onChange={(e) => handleImageChange(e, setCard4Image)}
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
}