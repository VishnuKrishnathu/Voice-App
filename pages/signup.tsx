import React, {useContext, useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';
import styles from "../styles/Login.module.css";
import firebase from 'firebase';

export default function signup() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");

    // Hide navbar and status bar👇 
    const updateNavState = useContext(NavbarDisplay);
    const updateSideBar = useContext(SidebarDisplay);
    updateNavState(false);
    updateSideBar(false);

    // Authentication method👇 
    const signupUser = () => {
        if (email === "" && password === "") return;
        else {
            let password_1 = (document.querySelector("#password") as HTMLInputElement).value;
            let password_2 = (document.querySelector("#confirm_password") as HTMLInputElement).value;
            let email_id = (document.querySelector("#emailID") as HTMLInputElement);
            if (password_1 !== password_2) return;
            if (!email_id.validity.valid) return;
        }
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log(userCredential);
            let user = userCredential.user;
        })
        .catch((error) => {
            console.log(error);
            setAlertMessage(error?.message);
        });
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            <div className={`py-2 ${styles.input_box_style}`}>
                <label htmlFor="emailID" >Email Id: </label>
                <input 
                    type="email" 
                    id="emailID" 
                    name="emailID" 
                    className={`${styles.input_bar_style} px-2`} 
                    onChange= {(e)=> {
                        setEmail(e.target.value);
                    }}
                />
            </div>
            <div className={`py-2 ${styles.input_box_style}`}>
                <label htmlFor="password" >Password: </label>
                <input type="password" id="password" name="password" className={`${styles.input_bar_style} px-2`} />
            </div>
            <div className={`py-2 ${styles.input_box_style}`}>
                <label htmlFor="confirm_password">Confirm Password: </label>
                <input 
                    type="password" 
                    id="confirm_password" 
                    name="confirm_password" 
                    onChange= {(e)=> {
                        setPassword(e.target.value);
                    }}
                    className={`${styles.input_bar_style} px-2`}
                />
            </div>
            <button 
                className={`py-1 px-2 mt-2 ${styles.button_style}`}
                onClick={signupUser}
            >SUBMIT</button>
            <div style={{color: "red"}}>{alertMessage}</div>
        </div>
    )
}
