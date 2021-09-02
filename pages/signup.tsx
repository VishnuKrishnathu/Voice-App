import React, {useContext, useState, useEffect } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { useRouter } from 'next/router';
import { AuthFunction } from "../Context/AuthContext";
import { SidebarContext } from '../components/Sidebar';
import { Form, Alert, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string | void>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const history = useRouter();

    // Hide navbar and status bar👇
    const updateNavState = NavbarDisplay();
    const updateSideBar = SidebarContext();
    updateNavState.hideNavBar();
    updateSideBar.hideSidebar();

    const { signupController } = AuthFunction();


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
            setLoadingState(false);
            return;
        };
        let message = signupController ?await signupController(email, password): "";
        setAlertMessage(message);
        // message === "" && history.push("/");
        setLoadingState(false);
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            {
                alertMessage !== "" && 
                <Alert variant="danger">{(typeof alertMessage === "string") ?alertMessage: null}</Alert>
            }
            <Form onSubmit={signupUser}>
                <Form.Group className="py-1">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control 
                        type="email" 
                        style= {{width: "max(250px, 27vw)"}}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete= ""
                    />
                </Form.Group>
                <Form.Group className="py-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        style= {{width: "max(250px, 27vw)"}}
                        required
                        id="password"
                        autoComplete = "new-password"
                    />
                </Form.Group>
                <Form.Group className="py-1">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control 
                        type="password" 
                        style= {{width: "max(250px, 27vw)"}}
                        id="confirm_password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        autoComplete = "new-password"
                    />
                </Form.Group>
                {!loadingState && <Button type="submit" className="mt-2">SIGN UP</Button>}
                {loadingState && <Button type="submit" className="mt-2" disabled={true}>Please wait ....</Button>}
            </Form>
            <div>
                Already have an account?
                <Link href="/login">
                    <a style={{display: "inline"}} className="mx-1">Login</a>
                </Link>
            </div>
        </div>
    )
}

export function getStaticProps (){
    
    return {
        props : {
            data : "Hello World"
        }
    }
}