import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid} from "@mui/material";

export default function CreateTemplate() { // todo add props as in CreateRoom

    return (
        <div className='flex flex-col flex-wrap gap-4'>
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
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                           for="shop_image">Upload shop image</label>
                    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                           id="shop_image" 
                           type="file"
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label for="start-balance" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                        Starting balance
                    </label>
                    <input type="text" 
                            id="start-balance" 
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
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card1-image">Upload card 1 image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card1-image" 
                       type="file"
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
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card2-image">Upload card 2 image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card2-image" 
                       type="file"
                    />
                </div>
        </div>
        {/* Card 3 */}
        <div className='flex flex-row gap-4'>  
            <label for="card3-rule" 
                class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
                >
                Card 3 Rule
            </label>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" 
                    id="card3-rule" 
                    value="" 
                    class="sr-only peer"/>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enable reset to start
                </span>
            </label>
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
                />
            </div>
            <div className='flex flex-col gap-4'>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
                       for="card4-image">Upload card 4 image</label>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                       id="card4-image" 
                       type="file"
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
                        onClick={() => handlePlayersChange()}
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
        </div>

      );


}