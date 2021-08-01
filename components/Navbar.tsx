import React, {createContext, useState} from 'react';
import Searchbar from './Searchbar';
import styles from '../styles/Navbar.module.css';

export const NavbarDisplay = createContext({});

export default function Navbar(props:any) {
    const [navbardisplay, setNavbarDisplay] = useState<boolean>(true);
    const [profileDropDown, setProfileDropDown] = useState<boolean>(false);

    function updateNavState(val: boolean){
        setNavbarDisplay(val);
    }
    return (
        <NavbarDisplay.Provider value={updateNavState}>
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
                            <input onChange={async(e)=> {
                                await setProfileDropDown(e.target.checked);
                            }} type="checkbox" id="dropdown_button" name="dropdown_button"/>
                        </div>
                    </div>
                </div>
            </div>
            </> : null}
            {props.children}
        </NavbarDisplay.Provider>
    )
}
