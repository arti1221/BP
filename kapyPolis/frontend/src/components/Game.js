import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link } from "react-router-dom";
import CreateRoom from "./CreateRoom"

// TODO
export default function Game() {
    const { roomCode } = useParams();

    return (
      <div className='flex flex-col flex-wrap gap-4'>
            <p>
                RoomCode: ${roomCode}
            </p>
        </div> 
    )
}
