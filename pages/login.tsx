import React, {useContext, useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';
import styles from "../styles/Login.module.css";
import firebase from 'firebase';

export default function login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");

    // Hide navbar and status bar👇
    const updateNavState = useContext(NavbarDisplay);
    const updateSideBar = useContext(SidebarDisplay);
    updateNavState(false);
    updateSideBar(false);

    const signUpHandler = () => {
        let email_input = (document.querySelector("#emailID") as HTMLInputElement);
        if(!email_input.validity.valid) return;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log(userCredential);
        })
        .catch((error) => {
            setAlertMessage(error.message);
        });
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            <div className={`py-2 ${styles.input_box_style}`}>
                <label htmlFor="emailID" >Email ID: </label>
                <input 
                    type="text" 
                    id="emailID" 
                    name="emailID" 
                    className={`${styles.input_bar_style} px-2`} 
                    onChange= {(e)=> setEmail(e.target.value)}
                />
            </div>
            <div className={`py-2 ${styles.input_box_style}`}>
                <label htmlFor="username" >Password: </label>
                <input 
                    type="password" 
                    id="username" 
                    name="username" 
                    className={`${styles.input_bar_style} px-2`}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button 
                className={`py-1 px-2 mt-2 ${styles.button_style}`}
                onClick= {signUpHandler}
            >SUBMIT</button>
            <div>{alertMessage}</div>
        </div>
    )
}
