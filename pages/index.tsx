import React, { useEffect, useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { AuthFunction } from '../Context/AuthContext';
import { Route } from '../Context/Env';
import styles from "../styles/Rooms.module.css";
import Link from 'next/link';

export default function managerooms() {
    const [rooms, setRooms] = useState<Array<any>>([]);
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    updateNavState.displayNavBar();
    const {accessToken} = AuthFunction();

    useEffect(function() {
        console.log("checking for the rooms", accessToken);
        fetch(`${Route.BASE_URL}/checkRooms`, {
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            }
        }).then( res => res.json())
        .then(data => {
            console.log(data)
            if(data.error !== undefined && data.error == false) setRooms(data.rooms);
        })
        .catch(err => console.log(err));
    }, [accessToken, Route])

    useEffect(() => {
        console.log(rooms)
    }, [rooms, accessToken])

    return (
        <div style = {{width : "100%", height: "100%"}} className="d-flex">
            <Link href="/createRoom">
                <div className={`${styles.room_card} mx-2 d-flex flex-column align-items-center justify-content-center `}>
                    <div style={{fontSize: "1.3rem"}}>Create Room</div>
                    <span>+</span>
                </div>
            </Link>
            {rooms.map(function(room){
                return(
                <Link href={`/${room._id}`}>
                    <div className={`${styles.room_card_data} mx-2 d-flex align-items-center justify-content-center`} >
                        <div>{room.roomName}</div>
                    </div>
                </Link>
                )
            })}
        </div>
    )
}
