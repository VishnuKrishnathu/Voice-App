import React, { useState } from 'react';
import { NavbarDisplay } from '../../components/Navbar';
import { SidebarContext } from '../../components/Sidebar';
import { Form, Button, Dropdown } from 'react-bootstrap';
import styles from '../../styles/Rooms.module.css';

export default function createRoom() {
    const [chatType, setChatType] = useState<string>("Chat type");

    // Hide navbar and sidebar👇
    const updateNavState = NavbarDisplay();
    const updateSideBar = SidebarContext();
    updateNavState.hideNavBar();
    updateSideBar.hideSidebar();

    return (
        <div style={{width: "100%", height:"100%"}}>
            <Form>
                <Form.Group className="m-1">
                    <Form.Label>Room Name :</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="room name" 
                        className={`${styles.room_input} mx-1`} 
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
            </Form>
        </div>
    )
}
