import React, {useContext, useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';
import { useRouter } from 'next/router';
import GoogleLogin from 'react-google-login';
import { AuthFunction } from '../Context/AuthContext';
import { Form, Button, Alert } from "react-bootstrap";
import firebase from 'firebase';

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string | void>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const history = useRouter()

    // Hide navbar and status bar👇
    const updateNavState = NavbarDisplay();
    const updateSideBar = useContext(SidebarDisplay);
    updateNavState(false);
    updateSideBar(false);

    type Inputfunc = {
        preventDefault : Function
    }
    const { signinController } = AuthFunction();

    const signUpHandler = async(e: Inputfunc) => {
        e.preventDefault();

        setAlertMessage("");
        setLoadingState(true);
        let message = signinController ? await signinController(email, password) : "";
        setAlertMessage(message);
        message == "" && history.push("/");
        setLoadingState(false);
    }

    const responseGoogle = (response:any) => {
        console.log(response);
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            {alertMessage !== "" && 
                <Alert variant="danger">
                    {(typeof alertMessage === "string") ?alertMessage: null}
                </Alert>}
            <Form onSubmit= {signUpHandler}>
                <Form.Group className="my-1">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control
                        type="email"
                        style= {{width: "max(250px, 25vw)"}}
                        required
                        onChange = {(e)=> {
                            setEmail(e.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group className="my-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        required
                        style= {{width: "max(250px, 25vw)"}}
                        onChange= {e => {
                            setPassword(e.target.value);
                        }}
                    />
                </Form.Group>
                <Button type="submit" className="mt-2" disabled= {loadingState}>LOGIN</Button>
            </Form>
        </div>
    )
}
