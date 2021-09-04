import React, { useEffect } from 'react';
import { NavbarDisplay } from '../../components/Navbar';
import { SidebarContext } from '../../components/Sidebar';
import styles from '../../styles/Chatroom.module.css';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Send from "../../public/send-button.svg";

export default function VoiceRooms() {

    useEffect(function(){
        console.log("component mounted");
    }, [])

    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    const updateSideBar = SidebarContext();
    updateNavState.displayNavBar();
    updateSideBar.showSidebar();

    return (
        <div className={`mx-3 ${styles.chat_container} d-flex`}>
            <Form.Control 
                as="textarea" 
                style={{resize: "none"}}
                className={`${styles.chat_textarea}`}
            />
            <Button className={`${styles.chat_send_button} p-0 d-flex align-items-center justify-content-center`}>
                <Image 
                    src={Send}
                    // height= "26"
                    // width = "26"
                />
            </Button>
        </div>
    )
}
