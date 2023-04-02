import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, Box,
    FormControl, FormControlLabel, RadioGroup, Radio, Alert, Collapse, InputLabel  
} from "@mui/material";
import { create } from '@mui/material/styles/createTransitions';

export default function CreateTemplate() { // todo add props as in CreateRoom

    return (
        <div className='flex flex-col flex-wrap gap-4'>
          {/* Header */}
          <Grid item xs={12} align="center">

            <Typography component='h1' variant='h1'>
                Create Template
            </Typography>
          </Grid>

          <div className='flex flex-row gap-4'>            
                        {/* Inner content for the input data of */}
          <div className='flex flex-col gap-4'>
                <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Template name"
                            helperText="Enter the template name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                </FormControl>

                <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Background Caption"
                            helperText="Enter the Caption for the game after start."
                            variant="outlined"
                            fullWidth
                            />
                </FormControl>
            
                <InputLabel htmlFor="image-input-1"
                    >Select bg image
                </InputLabel>
                <input
                    accept="image/*"
                    id="image-input-1"
                    type="file"
                />

                <FormControl style={{ marginBottom: 10, marginTop: 10}}>
                        <TextField 
                            required
                            type="number"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 1000 }}
                            label="Starting balance"
                            helperText="Enter players starting balance."
                            variant="outlined"
                            fullWidth
                            />
                </FormControl>

                <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Shop name"
                            helperText="Enter the Shop name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                </FormControl>

                <InputLabel htmlFor="image-input-2"
                    >Select shop image
                </InputLabel>
                <input
                    accept="image/*"
                    id="image-input-2"
                    type="file"
                />
          </div>
    
          {/* Column 2 */}

          <div className='flex flex-col gap-4'>
                    <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Card 1 name"
                            helperText="Enter the Card 1 name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                    </FormControl>
                    <InputLabel htmlFor="image-input-3"
                        >Select Card 1 image
                    </InputLabel>
                    <input
                        accept="image/*"
                        id="image-input-3"
                        type="file"
                    />

                    
                    <FormControl style={{ marginBottom: 10, marginTop: 10}}>
                            <TextField 
                                required
                                type="number"
                                value=""
                                // onChange={handleNumberOfPlayersChange}
                                inputProps={{ min: 1 }}
                                label="Move forwards Rule"
                                helperText="Enter amount of fields to move forward."
                                variant="outlined"
                                fullWidth
                                />
                    </FormControl>

                    {/* card 2 */}
                    <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Card 2 name"
                            helperText="Enter the Card 2 name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                    </FormControl>
                    <InputLabel htmlFor="image-input-4"
                        >Select Card 2 image
                    </InputLabel>
                    <input
                        accept="image/*"
                        id="image-input-4"
                        type="file"
                    />

                    <FormControl style={{ marginBottom: 10, marginTop: 10}}>
                            <TextField 
                                required
                                type="number"
                                value=""
                                // onChange={handleNumberOfPlayersChange}
                                inputProps={{ min: 1 }}
                                label="Move backwards Rule"
                                helperText="Enter amount of fields to move backwards."
                                variant="outlined"
                                fullWidth
                                />
                    </FormControl>

                    {/* Card 3 */}
                    <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Card 3 name"
                            helperText="Enter the Card 3 name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                    </FormControl>
                    <InputLabel htmlFor="image-input-5"
                        >Select Card 3 image
                    </InputLabel>
                    <input
                        accept="image/*"
                        id="image-input-5"
                        type="file"
                    />

                    
                    <FormControl style={{ marginBottom: 10, marginTop: 10}}>
                            <TextField 
                                required
                                type="number"
                                value=""
                                // onChange={handleNumberOfPlayersChange}
                                inputProps={{ min: 1 }}
                                label="Move backwards Rule"
                                helperText="Enter amount of fields to move backwards."
                                variant="outlined"
                                fullWidth
                                />
                    </FormControl>

                    {/* Card 4 */}
                    <FormControl style={{ marginBottom: 10 }}>
                        <TextField 
                            required
                            type="text"
                            value=""
                            // onChange={handleNumberOfPlayersChange}
                            inputProps={{ min: 2 }}
                            label="Card 4 name"
                            helperText="Enter the Card 4 name with max length of 20 characters."
                            variant="outlined"
                            fullWidth
                            />
                    </FormControl>
                    <InputLabel htmlFor="image-input-6"
                        >Select Card 4 image
                    </InputLabel>
                    <input
                        accept="image/*"
                        id="image-input-6"
                        type="file"
                    />

                    <FormControl style={{ marginBottom: 10, marginTop: 10}}>
                            <TextField 
                                required
                                type="number"
                                value=""
                                // onChange={handleNumberOfPlayersChange}
                                inputProps={{ min: 1 }}
                                label="Move backwards Rule"
                                helperText="Enter amount of fields to move backwards."
                                variant="outlined"
                                fullWidth
                                />
                    </FormControl>
          </div>
    
          {/* Column 3 */}
          <div className='flex flex-col gap-4'>
              <h2>Image Input 2</h2>
              {/* Image input content goes here */}
          </div>
        </div>
                    {/* BUTTONS */}
        <div className='flex flex-row gap-4 mx-auto'>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    size="large"
                    // onClick={() => handlePlayersChange()}
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#07da63',
                        },
                    }}
                    >
                    Create a Template
                </Button>
            </Grid>
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
                    Back
                </Button>
            </Grid>  
            </div>
        </div>
      );


}