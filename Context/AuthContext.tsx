import React, { createContext, useContext, useState, useEffect } from 'react';
import Route from './Env';
import { useRouter } from 'next/router';


interface AuthInterface {
    refreshAccessToken ?: {() :void },
    signupController ?: {(emailID: string, passwordConfirmed: string): Promise<any>},
    signinController ?: {(emailID: string, passwordConfirmed: string): Promise<string>},
    logOutFunction ?: {(): void},
    user ?: any
}
const AuthProvider = createContext<AuthInterface>({});

export const AuthFunction= ()=> {
    return useContext(AuthProvider);
}

type Props = {
    title? : string,
    children : JSX.Element
}

interface ISigninResponse {
    error : string,
    userCreated : boolean,
    accessToken : string,
    refreshToken : string
}

// Authentication method👇
export default function AuthContext(props: Props){
    const [accessToken, setAccessToken] = useState<string>("");


    const history = useRouter();

    // Refreshing and setting token👇
    async function refreshAccessToken (){
        let response = await fetch(`${Route().BASE_URL}/refresh`).then(res => res.json())
        .then((data: {
            verified : boolean,
            accessToken : string,
            error ?: string
        }) => {
            if(!data.verified) {
                history.push("/signup");
                setAccessToken("");
                return;
            };
            setAccessToken(data.accessToken);
        });
    }

    // Sign up function👇
    async function signupController (emailID: string, passwordConfirmed: string): Promise<any> {
        if (emailID === "" && passwordConfirmed === "") return "Please fillout the input fields";
        const response = await fetch(`${Route().BASE_URL}/signin`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailId: emailID,
                password: passwordConfirmed
            })
        }).then( res => res.json())
        .then((data : ISigninResponse)=> {
            if(! data.userCreated) return data.error;
            history.push('/');
            setAccessToken(data.accessToken);
            return "";
        })
        .catch(err => err.message);
        return response;
    };

    async function logOutFunction (){
        console.log("logged");
    };


    // Login up function👇 
    async function signinController (emailID: string, passwordConfirmed: string):Promise<string> {
        if (emailID === "" || passwordConfirmed === "") return "";
        try{
            let response = await fetch(`${Route().BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    emailID: emailID,
                    password: passwordConfirmed
                })
            }).then(res => res.json())
            .then((data : {(): void}) => console.log(data))
            .catch(err => console.log(err));
            return "";
        }
        catch(error){
            return error.message;
        }
    }

    // fetching access token if not found in the memory👇
    useEffect(function () {
        if(accessToken === "") refreshAccessToken();
    }, [accessToken])

    const value = {
        refreshAccessToken,
        signupController,
        signinController,
        logOutFunction,
        accessToken
    }
    return (
        <>
            <AuthProvider.Provider value={value}>
                {props.children}
            </AuthProvider.Provider>
        </>
    )
}
