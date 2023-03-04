import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
    const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(0);
    const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState(0);
    const { roomCode } = useParams();
    

    useEffect(() => {
        getRoomDetails();
    }, []);

    const getRoomDetails = () => { 
        console.log("Retrieving room details for code " + roomCode);
        fetch(`/api/get-room?code=${roomCode}`)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            setCurrentNumberOfPlayers(data.current_players);
            setMaxNumberOfPlayers(data.max_players);
        })
    }

    return (
        <div>
            <h3>
                RoomCode: {roomCode}
            </h3>
            <p>
                Current number of players: {currentNumberOfPlayers} / {maxNumberOfPlayers}
            </p>
        </div>
    );
}
