import React, { createContext, useContext, useState, useEffect } from 'react';
import app, {auth} from '../firebase';

interface AuthInterface {
    signupController ?: Function,
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

// Authentication method👇 
export default function AuthContext(props: Props){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [user, setUser] = useState<any>({});

    const signupController = async (emailID: string, passwordConfirmed: string): Promise<String> => {
        if (emailID === "" && passwordConfirmed === "") return "Please fillout the input fields";
        // await auth.createUserWithEmailAndPassword(emailID, passwordConfirmed)
        // .then((userCredential) => {
        //     console.log(userCredential);
        // })
        // .catch((error) => {
        //     console.log(error);
        //     return error?.message;
        // });
        // return "";
        try {
            let user_signed = await auth.createUserWithEmailAndPassword(emailID, passwordConfirmed)
            console.log(user_signed);
            return "";
        }
        catch(error){
            console.log(error);
            return error?.message;
        }
    }

    useEffect(()=> {
        console.log(user);
    }, [user])
    useEffect(()=> {
        auth.onAuthStateChanged(user => setUser(user));
    }, [])

    const value = {
        signupController,
        user
    }
    return (
        <>
            <AuthProvider.Provider value={value}>
                {props.children}
            </AuthProvider.Provider>
        </>
    )
}
