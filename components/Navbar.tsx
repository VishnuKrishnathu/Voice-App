import React, {createContext, useState, useContext } from 'react';
import Searchbar from './Searchbar';
import styles from '../styles/Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Navbar, NavDropdown, Container, Nav, Badge } from "react-bootstrap";
import { AuthFunction } from "../Context/AuthContext";
import profilePic from "../public/black-pp.webp";

type Props ={
    title? : string,
    children : JSX.Element
}

interface INavBar {
    hideNavBar : Function,
    displayNavBar : Function
}

const Navbardisplay = createContext<INavBar>({
    hideNavBar : function(){},
    displayNavBar : function(){}
});

export const NavbarDisplay = ()=> {
    return useContext(Navbardisplay);
}

export default function NavBar(props: Props) {
    const [navbardisplay, setNavbarDisplay] = useState<boolean>(true);

    const { logOutFunction, accessToken, userData } = AuthFunction();

    const updateNavState = {
        hideNavBar,
        displayNavBar
    }

    function hideNavBar(){
        setNavbarDisplay(false);
    }

    function displayNavBar() {
        setNavbarDisplay(true);
    }


    return (
        <Navbardisplay.Provider value={updateNavState}>
            <div className="d-flex flex-column" style={{height: "100vh"}}>
                <Navbar variant="light" sticky="top" style={{background : "var(--secondary-color)"}}>
                    <Container>
                        <Navbar.Brand href="/">Chat Application</Navbar.Brand>
                        <Searchbar token={accessToken}/>
                        <Nav>
                            <span
                                className={`d-flex align-items-center justify-content-center mx-2 ${styles.custom_badge}`}
                            >
                                {userData?.username}
                            </span>
                            <Button 
                                onClick={logOutFunction}
                                className="py-2 px-3"
                            >Logout</Button>
                            <NavDropdown title="More" id="basic-nav-dropdown">
                                <NavDropdown.Item href={`/profiles/${userData?.username}`}>Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/managerooms">Manage rooms</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Container>
                </Navbar>
                {props.children}
            </div>
        </Navbardisplay.Provider>
    )
}
