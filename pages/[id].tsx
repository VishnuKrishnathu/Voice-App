import React, { useEffect, useState } from 'react';
import styles from '../styles/Chatroom.module.css';
import { Button, Form, Navbar, NavDropdown, Container, Nav, Offcanvas, Badge } from 'react-bootstrap';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Send from "../public/send-button.svg";
import { Route } from "../Context/Env";
import { useRouter } from 'next/router';
import { AuthFunction } from '../Context/AuthContext';
import { SocketContext } from '../Context/SocketConnect';

const ChatArea = dynamic(function(){
    return (import('../components/ChatArea'));
}, {
    ssr: false
})

export default function VoiceRooms() {
    // message data interface
    interface IMessage {
        sender : string;
        message : string;
        messageId : number;
    }
    // interface room Model
    interface IRoomMembers {
        _id : string,
        username : string
    }
    interface IRoomModel {
        result : {
            roomDescription : string,
            _id ?: string,
            roomName : string,
            owner : string,
            roomMembers ?: Array<IRoomMembers>,
            admin ?: Array<IRoomMembers>,
            createdAt : string,
            updatedAt : string
        },
        members : {
            rows : [{
                isAdmin : 1 | 0,
                label :string,
                value :number
            }] | []
        }
    }
    // getting the socket context
    const { socket } = SocketContext();
    // Inintiating the socket connection
    const [ roomModel, setRoomModel ] = useState<IRoomModel>({
        result : {
            roomDescription : "",
            _id : "",
            roomName : "",
            owner : "",
            roomMembers : [{_id : "", username : ""}],
            admin : [{_id : "", username : ""}],
            createdAt : "",
            updatedAt : ""
        },
        members : { rows :
            []
        }
    });
    const [messages, setMessages ] = useState<Array<IMessage>>([{
        sender: "",
        message : "",
        messageId: 1
    }]);
    const [senderMessage, setSenderMessage] = useState<string>("");
    const [ roomId, setRoomId] = useState<string | string[] | undefined>("");
    const [ offCanvasState, setOffCanvasState ] = useState<boolean>(false);

    const history = useRouter();
    const { userData } = AuthFunction();

    useEffect(function(){
        setRoomId(history.query.id);
    }, [history])
    
    // checks if the room actually exists
    useEffect(function(){
        if(roomId == "") {
            return;
        }
        const controller = new window.AbortController();
        fetch(`${Route.BASE_URL}/validateRoomId?roomId=${roomId}`, {
            "signal": controller.signal
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => {console.log(`Error`, err)});


        return function(){
            controller.abort()
        }
    },[roomId]);

    useEffect(() => {
        if(!socket || roomId == "") {
            return;
        }

        socket.emit('join-room', roomId);
    }, [
        roomId, socket
    ]);

    useEffect(function(){
        if(!socket){ return }

        socket.on('receive-message', function(message : IMessage) {
            console.log("Message received", message);
            setMessages((prev : Array<IMessage>) => {
                return [...prev, message];
            });
        })

        return () => {socket.off('receive-message')}
    }, [socket])

    useEffect(() => {
        try{
            if(roomId == "" || !socket) return;
            socket.volatile.emit('send-message', senderMessage, roomId, userData);
        }catch(err){
            console.error("message not sent", err);
        }
    }, [senderMessage, socket, roomId, userData]);

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

    useEffect(function(){
        let controller = new window.AbortController();
        fetch(`${Route.BASE_URL}/getRoomInfo`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify({
                roomId,
                checkAdmin : false
            }),
            signal : controller.signal
        }).then(res => res.json())
        .then(function(data){
            console.log("members of the group", data);
            setRoomModel(data);
        }).catch(err => {});

        return function(){
            controller.abort();
        }
    }, [roomId])
    return (
        <>
        <div className={`mx-3 ${styles.chat_container} d-flex flex-column`} style={{flexGrow: 1}}>
            <Navbar variant="dark" bg="primary">
                <Container>
                    <Navbar.Brand>{roomModel.result?.roomName}</Navbar.Brand>
                    <Nav>
                        <NavDropdown title="Settings" id="navbarScrollingDropdown">
                            <NavDropdown.Item onClick={function(){setOffCanvasState(true)}}>Group details</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <ChatArea values={{userData, messages}}/>
            <Form className="d-flex align-items-center" onSubmit={sendMessageHandler}>
                <Form.Control 
                    as="textarea" 
                    style={{resize: "none"}}
                    className={`${styles.chat_textarea} m-0 p-0`}
                />
                <Button className={`${styles.chat_send_button} p-0 d-flex align-items-center justify-content-center`} type="submit">
                    <Image 
                        src={Send}
                        alt="send button"
                    />
                </Button>
            </Form>
        </div>
        <Offcanvas show={offCanvasState} onHide={function(){setOffCanvasState(false)}} placement="end" backdrop={false}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Group Members</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {roomModel.members?.rows.length !== 0 && roomModel.members?.rows.map(function(member, index){
                    return (
                        <div className={`p-2 d-flex border border-dark rounded align-items-center justify-content-between`} key={`${member.value}`}>
                            {member.label}
                            {member.isAdmin == 1 && <Badge bg="success" className="d-flex justify-content-center align-items-center mr-2">ADMIN</Badge>}
                        </div>
                    )
                })}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}
