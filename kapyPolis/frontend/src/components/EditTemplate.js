import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, Grid} from "@mui/material";
import {useSelector, shallowEqual} from "react-redux"; 
import InvalidOperation from './InvalidOperation'

export default function EditTemplate() {

    const [isLoggedIn, name] = useSelector((state) => [state.global.isLoggedIn, state.global.name], shallowEqual);
    const [templateNames, setTemplateNames] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("")
    const [firstSelection, setFirstSelection] = useState(false);
    const [error, setError] = useState(false);

    const handleSelection = (e) => { 
        const selectedValue = e.target.value;
        setSelectedTemplate(selectedValue);
        console.log("temp selected", selectedValue); 
      };

      useEffect(() => {
        getTemplateNames();
      }, [templateNames]);

      const getTemplateNames  = () => {
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
            if (templateNames.length > 0 && !firstSelection) {
              console.log("first template", templateNames[0]);
              setSelectedTemplate(templateNames[0]);
              setFirstSelection(true);
            }
        })
        .catch((error) => {
            console.log("e");
            console.log(error)
        })
      } 

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

    const editTemplate = () => {
        // TODO REUSE CREATETEMPLATE
    }

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
        {isLoggedIn && getSelection()}
        {isLoggedIn && getSelectTemplateButton()}
        {isLoggedIn && getBackButton()}
      </div>
    );
}