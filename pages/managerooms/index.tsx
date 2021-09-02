import React, { useEffect, useState } from 'react';
import { NavbarDisplay } from '../../components/Navbar';
import { SidebarContext } from '../../components/Sidebar';
import { AuthFunction } from '../../Context/AuthContext';
import { Route } from '../../Context/Env';
import styles from "../../styles/Rooms.module.css";
import Link from 'next/link';

export default function managerooms() {
    const [rooms, setRooms] = useState<Array<object>>([{}]);
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    const updateSideBar = SidebarContext();
    updateNavState.hideNavBar();
    updateSideBar.hideSidebar();
    const {accessToken} = AuthFunction();

    useEffect(function() {
        fetch(`${Route.BASE_URL}/checkRooms`, {
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            }
        }).then( res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }, [accessToken, Route])

    return (
        <div style = {{width : "100%", height: "100%"}}>
            <Link href="managerooms/createRoom/">
                <div className={`${styles.room_card} mx-2 d-flex flex-column align-items-center justify-content-center`}>
                    +
                </div>
            </Link>
        </div>
    )
}
