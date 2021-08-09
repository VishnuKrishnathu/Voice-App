import React, {useContext, useState } from 'react';
import { navbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';
import { useRouter } from 'next/router';
import GoogleLogin from 'react-google-login';
import { Form, Button, Alert } from "react-bootstrap";
import firebase from 'firebase';

export default function login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const history = useRouter()

    // Hide navbar and status bar👇
    const updateNavState = navbarDisplay();
    const updateSideBar = useContext(SidebarDisplay);
    updateNavState(false);
    updateSideBar(false);

    type Inputfunc = {
        preventDefault : Function
    }

    const signUpHandler = async(e: Inputfunc) => {
        e.preventDefault();

        setAlertMessage("");
        setLoadingState(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            history.push('/');
        })
        .catch((error) => {
            setLoadingState(false);
            setAlertMessage(error.message);
        });
    }

    const responseGoogle = (response:any) => {
        console.log(response);
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            {alertMessage !== "" && 
                <Alert variant="danger">
                    {alertMessage}
                </Alert>}
            <Form onSubmit= {signUpHandler}>
                <Form.Group className="my-1">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control
                        type="email"
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
