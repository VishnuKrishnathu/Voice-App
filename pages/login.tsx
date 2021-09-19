import React, { useState } from 'react';
import { NavbarDisplay } from '../components/Navbar';
import { useRouter } from 'next/router';
// import GoogleLogin from 'react-google-login';
import { AuthFunction } from '../Context/AuthContext';
import { Form, Button, Alert, InputGroup, FormControl } from "react-bootstrap";
import Link from "next/link";

export default function Login(props : {
    navbar : boolean,
    sidebar : boolean
}) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string | void>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const history = useRouter();

    // custom types and interfaces👇
    type Inputfunc = {
        preventDefault : Function
    }

    // Hide navbar and status bar👇
    const updateNavState = NavbarDisplay();
    updateNavState.hideNavBar();

    const { signinController } = AuthFunction();

    const signUpHandler = async(e: Inputfunc) => {
        e.preventDefault();

        setAlertMessage("");
        setLoadingState(true);
        let message = signinController ? await signinController(username, password) : "";
        setAlertMessage(message);
        message == "" && history.push("/");
        setLoadingState(false);
    }

    return (
        <div style={{width: "100%", display:"grid", placeItems:"center"}}>
            {alertMessage !== "" && 
                <Alert variant="danger">
                    {(typeof alertMessage === "string") ?alertMessage: null}
                </Alert>}
            <Form onSubmit= {signUpHandler} className={`d-flex justify-content-evenly align-items-center flex-column`}>
                <Form.Group className="my-1">
                    <Form.Label >
                        Username
                    </Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>@</InputGroup.Text>
                        <FormControl 
                            id="inlineFormInputGroup" 
                            placeholder="Username" 
                            onChange={e => setUsername(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="my-1" style={{width: "100%"}}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        required
                        placeholder="Password"
                        onChange= {e => {
                            setPassword(e.target.value);
                        }}
                    />
                </Form.Group>
                <Button type="submit" className="mt-2" disabled= {loadingState}>LOGIN</Button>
            </Form>
            <div>
                Don{`'`}t have an account?
                <Link href="/signup"><a className="mx-1" style={{
                    display: "inline"
                }}>Signup</a></Link>
            </div>
        </div>
    )
};

export async function getStaticProps(context : any){
    return {
        props : {
            navbar : false,
            sidebar : false
        }
    }
}
