import React, {useContext, useState, useEffect } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { useRouter } from 'next/router';
import { AuthFunction } from "../Context/AuthContext";
import { Form, Alert, Button, InputGroup, FormControl } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import SuccessUsername from '../public/success-username.svg';
import ErrorUsername from '../public/error-username.svg';
import {Route} from '../Context/Env';

export default function Signup() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string | void>("");
    const [username, setUsername] = useState<string>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [usernameError, setUsernameError] = useState<boolean>(true);

    const history = useRouter();

    // Hide navbar and status bar👇
    const updateNavState = NavbarDisplay();
    updateNavState.hideNavBar();

    const { signupController } = AuthFunction();


    // Authentication method👇 
    type Inputfunc = {
        preventDefault : Function
    }
    const signupUser = async (e : any) => {
        e.preventDefault();
        if(usernameError) return;
        console.log(e.target["1"].value);
        setLoadingState(true);
        setAlertMessage("");
        let password_1 = (document.querySelector("#password") as HTMLInputElement).value;
        let password_2 = (document.querySelector("#confirm_password") as HTMLInputElement).value;
        if (password_1 !== password_2) {
            setAlertMessage("Password mismatch");
            setLoadingState(false);
            return;
        };
        let message = signupController ?await signupController(email, password, username): "";
        setAlertMessage(message);
        message === "" && history.push("/");
        setLoadingState(false);
    }

    function validateUsername(e : any){
        if(e.target.value == "") setUsernameError(true);
        let user_arr = e.target.value.split(" ");
        if(user_arr.length >= 2) {
            setAlertMessage("Username cannot have a space");
        }else{
            setUsername(e.target.value);
            fetch(`${Route.BASE_URL}/validateUsername?username=${e.target.value}`)
            .then(res => res.json())
            .then((data : {
                error : boolean,
                message : string
            }) => {
                !data.error && setUsernameError(false);
                if(data.error){
                    setAlertMessage(data.message);
                }
            })
            .catch(err => console.log(err));
        }
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
                    <Form.Label>Username</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>
                        {
                            usernameError ? 
                            <Image 
                                src={ErrorUsername}
                            /> : 
                            <Image 
                                src = {SuccessUsername}
                            />
                        }
                        </InputGroup.Text>
                        <FormControl
                            id="inlineFormInputGroup" 
                            placeholder="Username" 
                            style= {{width: "max(250px, 27vw)"}}
                            value = {username}
                            onChange={validateUsername}
                        />
                    </InputGroup>
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