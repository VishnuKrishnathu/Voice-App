import React, { useEffect, useState, useRef } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import styles from '../styles/Chatroom.module.css';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Send from "../public/send-button.svg";
import { Route } from "../Context/Env";
import { useRouter } from 'next/router';
import { AuthFunction } from '../Context/AuthContext';
import io from "socket.io-client";

export default function VoiceRooms() {
    // message data interface
    interface IMessage {
        sender : string;
        message : string;
        messageId : number;
    }
    // Inintiating the socket connection
    const [ socket, setSocket ] = useState<any>();
    const [messages, setMessages ] = useState<Array<IMessage>>([{
        sender: "",
        message : "",
        messageId: 1
    }]);
    const [senderMessage, setSenderMessage] = useState<string>("");
    const [ roomId, setRoomId] = useState<string>("");
    const [ randomNumber, setRandomNumber] = useState<number>(0);

    const history = useRouter();
    const { userData } = AuthFunction();


    
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    updateNavState.displayNavBar();

    useEffect(function(){
        let roomarr = window.location.href.split("/");
        setRoomId(roomarr[roomarr.length-1]);
    }, [])
    
    // checks if the room actually exists
    useEffect(function(){
        if (roomId == "") return;
        console.log("Room Id is here >>>", roomId)
        const controller = new window.AbortController();
        fetch(`${Route.BASE_URL}/validateRoomId?roomId=${roomId}`, {
            "signal": controller.signal
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => history.push('/'));

        setSocket((prev :any) => {
            let socket = io(`${Route.BASE_URL}`, {
                transports : ['websocket']
            });
            socket.emit('join-room', roomId);
            return socket;
        });

        return function(){
            controller.abort()
        }
    },[roomId, Route]);

    useEffect(() => {
        try{
            socket.on('receive-message', function(message : IMessage) {
                console.log("Message received", message);
                setMessages((prev : Array<IMessage>) => {
                    return [...prev, message];
                });
            })
        }catch(err){
            console.log("Error in receiving message", err);
        }
    }, [
        socket
    ])

    useEffect(() => {
        try{
            if(roomId == "" || !socket) return;
            socket.emit('send-message', senderMessage, roomId, userData);
        }catch(err){
            console.error("message not sent", err);
        }
    }, [senderMessage, socket, roomId]);

    function sendMessageHandler(e :any){
        e.preventDefault();
        setSenderMessage(e.target["0"].value);
        let message = e.target["0"].value;
        setMessages((prev :Array<any>) => {
            return [...prev, {
                sender : userData?.username,
                message,
                messageId : Date.now()
            }];
        });
        e.target["0"].value = "";
        e.target[0].focus();
    }

    // useEffect(()=> console.log(messages), [messages]);

    return (
        <div className={`mx-3 ${styles.chat_container} d-flex flex-column`}>
            <div className={`${styles.chat_message_area} d-flex flex-column`}>
                <div className={`${styles.log}`}>
                {
                    messages.map(message => {
                        if(message.message !== ""){
                        return(
                                <div className={`${styles.messageBox}`}>
                                <span className={`${styles.meta}`}>
                                    <span className={`${styles.badges}`}>
                                    </span>
                                    <span className={`${styles.name} ${message.sender == userData?.username && styles.wrapper}`}>{message.sender}</span>
                                    <i className={`${styles.metaBG}`}></i>
                                </span>

                                <span className={`${styles.message}`}>{message.message}</span>
                                </div>
                            
                        )
                        }
                    })
                }
                </div>
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
