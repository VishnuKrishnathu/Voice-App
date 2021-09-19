import React, { useState, useEffect } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { Form, Button, Dropdown, FloatingLabel, Alert } from 'react-bootstrap';
import styles from '../styles/Rooms.module.css';
import { Route } from "../Context/Env";
import { AuthFunction } from '../Context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CreateRoom() {
    const [chatType, setChatType] = useState<string>("Everyone");
    const [alertMessage, setAlertMessage] = useState<string>("");

    const history = useRouter();
    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    updateNavState.hideNavBar();

    function submitHandler(e : any){
        setAlertMessage("");
        e.preventDefault();
        let data = {
            roomName : `${e.target["0"].value}`,
            roomType : `${chatType}`,
            voiceRoom : e.target["2"].checked,
            roomDescription : `${e.target["4"].value}`
        }
        fetch(`${Route.BASE_URL}/addRoom`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'authorization' : `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify(data)
        }).then( res => res.json())
        .then((data : {
            roomCreated : boolean,
            message : string
        }) => {
            setAlertMessage(data.message);
        })
        .catch(err => console.log(err));
    }

    return (
        <div style={{width: "100%", height:"100%"}}>
            <Form onSubmit={ submitHandler }>
                <Form.Group className="m-1">
                    <Form.Label>Room Name :</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="room name" 
                        className={`${styles.room_input} mx-1`} 
                        required
                    />
                </Form.Group>
                <Form.Group className="m-1">
                    <Form.Label>Chat type:</Form.Label>
                        <Dropdown className="d-inline-block mx-1" onSelect = {(eventKey:any, event: Object) => {
                            typeof eventKey == "string" && setChatType(eventKey);
                        }}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                { chatType }
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Owner">Owner</Dropdown.Item>
                                <Dropdown.Item eventKey="Admins only">Admins only</Dropdown.Item>
                                <Dropdown.Item eventKey="Everyone">Everyone</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                </Form.Group>
                <Form.Group className="m-1">
                    <Form.Label>Enable Voice Room : </Form.Label>
                    <Form.Check
                        className="mx-1"
                        type="checkbox" 
                        inline
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Add admins :</Form.Label>
                    <Form.Control 
                        type="email"
                        className={`mx-1 ${styles.room_input}`}
                    />
                </Form.Group>
                <Form.Group className="m-1">
                    <FloatingLabel controlId="floatingTextarea2" label="Chat description">
                        <Form.Control
                        as="textarea"
                        placeholder="Chat description"
                        style={{ height: '100px' , width: "40%", resize: "none"}}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Button type="submit" className="mx-1">Submit</Button>
                {alertMessage!== "" && <Alert variant="primary" className="m-1" style={{
                    width: "max-content"
                }}>{alertMessage}</Alert>}
                <br/>
                <Button className="my-2 mx-1" onClick={function(){
                    history.push('/managerooms');
                }}>Back</Button>
            </Form>
        </div>
    )
}
