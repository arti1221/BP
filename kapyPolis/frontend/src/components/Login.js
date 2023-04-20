import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Button, Grid} from "@mui/material";
import Alert from './Alert'
import {useDispatch} from 'react-redux';
import {SET_ENTERED, SET_LOGGED_IN, SET_NAME} from '../redux/actions/action'
import Success from './Success'
import {useSelector, shallowEqual} from "react-redux"; 

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

export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const csrftoken = getCookie('csrftoken');
    const dispatch = useDispatch();
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();
    const [caption, setCaption] = useState("BACK");
    const [isLoggedIn] = useSelector((state) => [state.global.isLoggedIn], shallowEqual);

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
      }, [name, password, isLoggedIn]);

      const handleLogin = async () => {
        const uploadData = new FormData();
        uploadData.append('name', name);
        uploadData.append('password', password);
        fetch("/api/authorize", {
            method: 'POST',
            headers: { 
                'X-CSRFToken': csrftoken, // include the CSRF token in the headers
            },
            body: uploadData
        })
        .then((response) => { 
            if (response.ok) {
                console.log("Logged in successfully!");
                dispatch({type: SET_ENTERED, value: true});
                dispatch({type: SET_LOGGED_IN, value: true});
                dispatch({type: SET_NAME, value: name});
                setSuccessMsg("Logged in successfully!");
                setCaption("ENTER MENU")
            } else {
                setError("Wrong credentials!");
            }
            setName("");
            setPassword("");
            return response.json();
        })
        .then((data) => { // todo add validation msg and error msg
            console.log("Response data: ", data);
        })
        .catch((error) => {
            console.log("ERROR");
            console.error(error);
        });
    }
    

    const getLoginButton = () => {
        return (
            <div className='flex flex-col flex-wrap gap-4'>     
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleLogin()}
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#07da63',
                        },
                    }}
                    >
                    LOGIN
                </Button>
            </Grid>
        </div>
        );
    }

    return (
    <div className='flex flex-col flex-wrap gap-4'>
        {successMsg != null ? <div className='flex flex-col gap-4'><Success msg={successMsg}/></div> : null}
        {error != null ? <div className='flex flex-col gap-4'><Alert msg={error}/></div> : null}

        {/* Header */}
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                Log In 
            </h1>
        </div>

    <div className='flex flex-row gap-4'>
          <div className='flex flex-col gap-4'>
              <label for="user-name" class="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  Username
              </label>
              <input type="text" 
                      id="user-name" 
                      onChange={handleName}
                      value={name}
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter name."
              />
            </div>
            <div className='flex flex-col gap-4'>
                <label htmlFor="password-input" className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                Password
                </label>
                <input 
                type="password" 
                id="password-input" 
                onChange={handlePassword}
                value={password}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Code"
                required
                />
            </div>
        </div>
        
        {isLoggedIn ? null :  getLoginButton()}

        {/* Back button */}
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
                            {caption}
                        </Button>
                    </Grid>
                </div>
            </div>

        </div>
    );
}