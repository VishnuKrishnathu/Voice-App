import React, {useContext, useState } from 'react';
import { navbarDisplay } from '../components/Navbar';
import AuthContext, { AuthFunction } from "../Context/AuthContext";
import { SidebarDisplay } from '../components/Sidebar';
import styles from "../styles/Login.module.css";
import { Form, Alert, Button } from 'react-bootstrap';
import firebase from 'firebase';

export default function signup() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);

    // Hide navbar and status bar👇 
    const updateNavState = navbarDisplay();
    const updateSideBar = useContext(SidebarDisplay);
    updateNavState(false);
    updateSideBar(false);
    const {signupController} = AuthFunction();

    // Authentication method👇 
    type Inputfunc = {
        preventDefault : Function
    }
    const signupUser = async (e : Inputfunc) => {
        e.preventDefault();
        setLoadingState(true);
        setAlertMessage("");
        let password_1 = (document.querySelector("#password") as HTMLInputElement).value;
        let password_2 = (document.querySelector("#confirm_password") as HTMLInputElement).value;
        if (password_1 !== password_2) {
            setAlertMessage("Password mismatch");
            return;
        };
        let message = signupController ?await signupController(email, password) : "";
        setAlertMessage(message);
        setLoadingState(false);
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            {
                alertMessage !== "" && 
                <Alert variant="danger">{alertMessage}</Alert>
            }
            <Form onSubmit={signupUser}>
                <Form.Group className="py-1">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control 
                        type="email" 
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="py-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        required
                        id="password"
                    />
                </Form.Group>
                <Form.Group className="py-1">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control 
                        type="password" 
                        id="confirm_password"
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" className="mt-2" disabled={loadingState}>SIGN UP</Button>
            </Form>
        </div>
    )
}
