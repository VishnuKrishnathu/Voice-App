import React, { createContext, useContext, useState, useEffect } from 'react';
import {Route} from './Env';
import { useRouter } from 'next/router';

interface IUserModel {
    emailId ?: string;
    password ?: string;
    username ?: string;
    userId ?: number;
}

interface AuthInterface {
    refreshAccessToken ?: {() :void };
    signupController ?: {(emailID: string, passwordConfirmed: string, username : string): Promise<string | void>};
    signinController ?: {(username: string, passwordConfirmed: string): Promise<string | void>};
    logOutFunction ?: {(): void};
    accessToken ?: string;
    userData ?: IUserModel;

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
    const [userData, setUserData] = useState<IUserModel>({
        emailId : "",
        password: "",
        username: ""
    })


    const history = useRouter();

    // Sign up function👇
    async function signupController (emailID: string, passwordConfirmed: string, username : string): Promise<string | void> {
        if (emailID === "" && passwordConfirmed === "") return "Please fillout the input fields";
        const response = await fetch(`${Route.BASE_URL}/signin`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailId: emailID,
                password: passwordConfirmed,
                username : username
            })
        }).then( res => res.json())
        .then((data : ISigninResponse)=> {
            if(! data.userCreated) return data.error;
            history.push('/');
            localStorage.setItem('token', data.accessToken);
            return "";
        })
        .catch(err => err.message);
        return response;
    };

    function logOutFunction (){
        console.log("logout function called");
        fetch(`${Route.BASE_URL}/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => setAccessToken(function(token : string){
            history.push("/login");
            return "empty";
        }))
        .catch(err => {});
    };

    useEffect(function() {
        setAccessToken(prev => {
            let token = localStorage.getItem("token");
            if(typeof token == "string") return token;
            return prev;
        });

        return () => {
            setAccessToken("");
        }
    }, [
        signinController,
        signupController
    ])

    // Login up function👇 
    async function signinController (username: string, passwordConfirmed: string):Promise<string | void> {
        if (username === "" || passwordConfirmed === "") return "";
        let response = await fetch(`${Route.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify({
                username : username,
                password: passwordConfirmed
            })
        }).then(res => res.json())
        .then((data : {
            loggedIn : boolean,
            error : string,
            accessToken ?: string
        }) => {
            if(!data.loggedIn) return data.error;
            data.accessToken && localStorage.setItem("token", data.accessToken);
            return "";
        })
        .catch(err => {});
        return response;
    }

    // fetching access token if not found in the memory👇
    useEffect(function () {
        fetch(`${Route.BASE_URL}/getUser`, {
            method : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            console.log("access token fetched");
            setUserData(data);
        })
        .catch(err => {});
    }, [accessToken]);

    const value = {
        signupController,
        signinController,
        logOutFunction,
        accessToken,
        userData
    }
    return (
        <>
            <AuthProvider.Provider value={value}>
                {props.children}
            </AuthProvider.Provider>
        </>
    )
}
