import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, Box,
    FormControl, FormControlLabel, RadioGroup, Radio, Alert, Collapse 
} from "@mui/material";
import { create } from '@mui/material/styles/createTransitions';
import Success from './Success'

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

export default function Template() {
    const csrftoken = getCookie('csrftoken');
    const { name } = useParams(); // The template name, hook
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(1000); // 1k by default
    const [maxItemPrice, setMaxItemPrice] = useState(2000);
    const [itemImage, setItemImage] = useState(null); // image null by default.
    const navigate = useNavigate();
    const location = useLocation();

    const handleItemName = (e) => {
        setItemName(e.target.value);
        console.log("Item name changed to: ", itemName);
    };

    const handleItemPrice = (e) => {
      setItemPrice(parseInt(e.target.value));
      console.log("Item price changed to: ", itemPrice);
  };

    const handleMaxItemPrice = (e) => {
      setMaxItemPrice(parseInt(e.target.value));
      console.log("Max Item price changed to: ", maxItemPrice);
  };

    const handleItemImage = (e) => {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
          setItemImage(reader.result);
        };
      }
    };

    const handleCreateShopItem = async () => { 
      console.log("My csrf token: ", csrftoken);
      const uploadData = new FormData();
      uploadData.append('template', name);
      uploadData.append('name', itemName);
      uploadData.append('image', itemImage);
      uploadData.append('price', itemPrice);
      uploadData.append('price_max', maxItemPrice);
      try {
        const response = await fetch("/api/create-shop-items", {
          method: 'POST',
          headers: { 
              'X-CSRFToken': csrftoken, // include the CSRF token in the headers
          },
          body: uploadData
        });
        console.log("creating shop-item with data that have been set.")
        if (response.ok) {
          // reset the state of the input fields
          setItemName("");
          setItemPrice(1000);
          setItemImage(null);
          // show a success message
          window.location.reload();
          navigate(`/template/${name}`, {state: {successMsg:`Item successfuly created!`}});
        } else {
          throw new Error('Failed to create shop item.');
        }
      } catch (error) {
        console.error(error);
        // show an error message
      }
    };
    

    useEffect(() => { // applies the method on render
      getTemplate();
      console.log("Fetching data for existing Room: ", name)
  }, [name]);

    const getTemplate = () => { 
      console.log("Retrieving details for template: " + name);
      if (!name) {
          return;
      }
      fetch(`/api/get-template?name=${name}`, { credentials: 'include' }) // include headers
      .then((response) => {
          // add if statement to differentiate whether the room exists or not. If not, clear the code and navigate to the HP
          if (!response.ok) {
            navigate("/", {state: {errorMsg: `Failed to fetch Template with name ${name}`}});
          } else {
            console.log(response);
            return response.json();
          }
      })
      .then((data) => {
          console.log("Retrieving data for the template:", data);
      })
      .catch((error) => {
          console.log("e");
          console.log(error)
      })
  }

    return (
      <form className='flex flex-col flex-wrap gap-4'>
        {location?.state?.successMsg ? <Success msg={location.state.successMsg}/> : null}
                {/* Header */}
        <div className='flex justify-center'> 
          <h4 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
            Template: {name}
          </h4>
        </div>

        <div className='flex flex-row gap-4'>
          <div className='flex flex-col gap-4'>
              <label for="item-name" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  Item name
              </label>
              <input type="text" 
                      id="item-name" 
                      onChange={handleItemName}
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter item name."
              />
            </div>
        </div>
        <div className='flex flex-col gap-4'>
            <label for="item-price" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                Item price
            </label>
            <input type="text" 
                    id="item-price" 
                    onChange={handleItemPrice}
                    min={1}
                    aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Enter min price, min 1"
            />
          </div>
          <div className='flex flex-col gap-4'>
            <label for="max-item-price" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                Max Item price
            </label>
            <input type="text" 
                    id="max-item-price" 
                    onChange={handleMaxItemPrice}
                    min={1}
                    aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="enter max price, max. 1000"
            />
          </div>
          <div className='flex flex-col gap-4'>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                      for="shop_image">Upload shop image</label>
              <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                      id="shop_image" 
                      type="file"
                      onChange={handleItemImage}
              />
          </div>

          {/* BUTTONS */}
        <div className='flex flex-row gap-4 justify-center'>            
          <div className='flex flex-col flex-wrap gap-4'>     
              <Grid item xs={12} align="center">
                  <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleCreateShopItem()}
                      sx={{
                          backgroundColor: '#3f51b5',
                          color: '#fff',
                          '&:hover': {
                          backgroundColor: '#07da63',
                          },
                      }}
                      >
                      CREATE AN ITEM
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
                      BACK TO MENU
                  </Button>
              </Grid>
              </div>
          </div>
      </form>
    );
}