import React, { useEffect, useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import styles from '../styles/Chatroom.module.css';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Send from "../public/send-button.svg";
import { Route } from "../Context/Env";
import { useRouter } from 'next/router';
import { AuthFunction } from '../Context/AuthContext';
import {io} from "socket.io-client";

export default function VoiceRooms() {
    const [messages, setMessages ] = useState<Array<any>>([]);

    const history = useRouter();

    const { userData } = AuthFunction();

    useEffect(() => {
    })
    
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    updateNavState.displayNavBar();
    
    // checks if the room actually exists
    useEffect(function(){
        const controller = new window.AbortController();
        let roomarr = window.location.href.split("/");
        let roomId = roomarr[roomarr.length-1];
        console.log(roomId);
        fetch(`${Route.BASE_URL}/validateRoomId?roomId=${roomId}`, {
            "signal": controller.signal
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => history.push("/"));

        return function(){
            controller.abort()
        }
    }, 
    []
    );


    function sendMessageHandler(e :any){
        e.preventDefault();
        let senderMessage = e.target["0"].value;
        setMessages((prev :Array<any>) => {
            return [...prev, {
                sender : userData?.username,
                message : senderMessage
            }];
        });
        e.target["0"].value = "";
    }

    useEffect(()=> console.log(messages), [messages]);

    return (
        <div className={`mx-3 ${styles.chat_container} d-flex flex-column`}>
            <div className={`${styles.chat_message_area} d-flex flex-column`}>
                {
                    messages.map(message => {
                        console.log(message.sender);
                        if(message.message !== ""){
                        return(
                            <div 
                                className={`my-2 ${styles.sender_chat} p-2 rounded mx-2`}
                                style={message.sender == userData?.username ?{alignSelf: "flex-end", background: "#4e6290"}: {}}
                            >
                                {message.message}
                            </div>
                        )
                        }
                    })
                }
            </div>
            <Form className="d-flex align-items-center" onSubmit={sendMessageHandler}>
                <Form.Control 
                    as="textarea" 
                    style={{resize: "none"}}
                    className={`${styles.chat_textarea} m-0 p-0`}
                />
                <Button className={`${styles.chat_send_button} p-0 d-flex align-items-center justify-content-center`} type="submit">
                    <Image 
                        src={Send}
                    />
                </Button>
            </Form>
        </div>
    )
}
