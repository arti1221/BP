import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, ButtonGroup } from "@mui/material";
import Alert from './Alert'

export default function Register() {
    return (
    <div className='flex flex-col flex-wrap gap-4'>

        {/* Header */}
        <div className='flex justify-center'> 
            <h1 class="mt-0 mb-2 text-5xl font-medium leading-tight text-white font-sans content-center">
                Register
            </h1>
        </div>

        </div>
    );
}