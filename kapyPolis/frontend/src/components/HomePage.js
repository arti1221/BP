import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import RoomJoin from './RoomJoin';
import CreateRoom from './CreateRoom';
import Room from './Room';
import Template from './Template';
import CreateTemplate from './CreateTemplate';
import Help from './Help'
import HomePageMenu from './HomePageMenu'
import Game from './Game'
import Register from './Register'
import Login from './Login'
import EditTemplate from './EditTemplate'

export default function HomePage() {

    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        // This will be called only once after the component is mounted
        if (!roomCode) {
            return;
        }
        fetchData();
      }, [roomCode]);

    const fetchData = async () => { // TODO FIX
        fetch('/api/users-room')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setRoomCode(data.code);
        })
      };

    return (
    <BrowserRouter>
        <Routes>
            {/* <Route path='/' element={createHomePage()}/> */}
            <Route path="/" element={<HomePageMenu/>}/> 
            <Route path='/join' element={<RoomJoin />}/>
            <Route path='/create' element={<CreateRoom />}/>
            <Route path='/room/:roomCode' element={<Room/>}/>
            <Route path='/template' element={<CreateTemplate/>}/>
            <Route path='/template/:name' element={<Template/>}/>
            <Route path='/help' element={<Help/>}/>
            <Route path='/room/:roomCode/game' element={<Game/>}/>
            <Route path='/create-user' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/update-template' element={<EditTemplate/>}/>
            {/* <Route path='/room/:roomCode' element={<Room clearRoomCode={clearRoomCode} />} /> */}
            <Route path='*' element={<h1>ERROR 404 PAGE NOT FOUND.</h1>}/> // 404 not found page, every route that is valid has to be above this root.
        </Routes>
    </BrowserRouter>
    )
}
