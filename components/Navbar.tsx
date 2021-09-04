import React, {createContext, useState, useContext } from 'react';
import Searchbar from './Searchbar';
import styles from '../styles/Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ListGroup, Button } from "react-bootstrap";
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

export default function Navbar(props: Props) {
    const [navbardisplay, setNavbarDisplay] = useState<boolean>(true);
    const [profileDropDown, setProfileDropDown] = useState<boolean>(false);

    const { logOutFunction } = AuthFunction();

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
            {navbardisplay ? <>
            <div style={{
                position: "sticky"
            }}>
                <div className={styles.navbar}>
                    <Searchbar/>
                    <div className={styles.profile_section} style={{display:"flex"}}>
                        <Image
                            src={ profilePic }
                            alt="profile picture"
                            className={styles.profile_section_img}
                            height="33"
                            width= "33"
                        />
                        <div>
                            <label htmlFor="dropdown_button">
                                <img src="https://s2.svgbox.net/materialui.svg?ic=arrow_drop_up&color=415265" style={
                                    profileDropDown ? {transform: "rotate(0deg)"} : {
                                        transform: "rotate(180deg)"
                                    }
                                }/>
                            </label>
                            <input 
                                onChange={async(e)=> {
                                    await setProfileDropDown(e.target.checked);
                                }} 
                                type="checkbox" 
                                id="dropdown_button" 
                                name="dropdown_button" 
                            />
                            <ListGroup 
                                className={styles.dropdown_options} 
                                style ={!profileDropDown ? {
                                    height: "0px"
                                }: {}}
                            >
                                <ListGroup.Item>Profile</ListGroup.Item>
                                <ListGroup.Item className="p-0">
                                    <Button 
                                        onClick={logOutFunction}
                                        className="py-2 px-3"
                                        style={{width: "100%"}}
                                    >Logout</Button>
                                </ListGroup.Item>
                                <ListGroup.Item className="p-0">
                                    <Link href="/managerooms">
                                        <Button
                                            style={{width: "100%"}}
                                        >Manage rooms</Button>
                                    </Link>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
            </> : null}
            {props.children}
        </Navbardisplay.Provider>
    )
}
