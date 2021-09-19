import React, { useEffect, useState } from 'react';
import { NavbarDisplay } from '../../components/Navbar';
import { AuthFunction } from '../../Context/AuthContext';
import { Route } from '../../Context/Env';
import styles from "../../styles/Rooms.module.css";
import Link from 'next/link';

export default function managerooms() {
    const [rooms, setRooms] = useState<Array<any>>([]);
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    updateNavState.displayNavBar();

    useEffect(function() {
        let accessToken = localStorage.getItem("token");
        if(!accessToken) { return };
        console.log("checking for the rooms", accessToken);
        fetch(`${Route.BASE_URL}/checkRooms`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({
                editAccess : true
            })
        }).then( res => res.json())
        .then(data => {
            console.log(data)
            if(data.error !== undefined && data.error == false) setRooms(data.rooms);
        })
        .catch(err => console.log(err));
    }, [Route])

    return (
        <div style = {{width : "100%", height: "100%"}} className="d-flex mt-2">
            {rooms.map(function(room){
                return(
                <Link href={`/managerooms/${room._id}`}>
                    <div className={`${styles.room_card_data} mx-2 d-flex align-items-center justify-content-center`} >
                        <div>{room.roomName}</div>
                    </div>
                </Link>
                )
            })}
        </div>
    )
}
