import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import RoomJoin from './RoomJoin';
import CreateRoom from './CreateRoom';
import Room from './Room';

export default function HomePage() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<p> Home Page. </p>}/>
            <Route path='/join' element={<RoomJoin />}/>
            <Route path='/create' element={<CreateRoom />}/>
            <Route path='/room/:roomCode' element={<Room/>}/>
            <Route path='*' element={<h1>ERROR 404 PAGE NOT FOUND.</h1>}/> // 404 not found page, every route that is valid has to be above this root.
        </Routes>
    </BrowserRouter>
    )
}