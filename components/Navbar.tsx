import React, {createContext, useState, useContext } from 'react';
import Searchbar from './Searchbar';
import styles from '../styles/Navbar.module.css';
import { ListGroup, Button } from "react-bootstrap";
import { AuthFunction } from "../Context/AuthContext";

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
                        <img 
                            src="black-pp.webp" 
                            alt="profile picture"
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
                                    >Logout</Button>
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
