import React, { createContext, useContext, useState, useEffect } from 'react';
import app, {auth} from '../firebase';

interface AuthInterface {
    signupController ?: Function,
    signinController ?: Function,
    logOutFunction ?: Function,
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

    // Sign up function👇
    const signupController = async (emailID: string, passwordConfirmed: string): Promise<String> => {
        if (emailID === "" && passwordConfirmed === "") return "Please fillout the input fields";
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

    const logOutFunction = ()=> {
        auth.signOut();
    }


    // Login up function👇 
    const signinController = async(emailID: string, passwordConfirmed: string):Promise<string> => {
        if (emailID === "" || passwordConfirmed === "") return "";
        try{
            let user_signed = await auth.signInWithEmailAndPassword(emailID, passwordConfirmed);
            return "";
        }
        catch(error){
            return error.message;
        }
    }

    useEffect(()=> console.log(user), [user]);

    // Setting logged in user👇
    useEffect(()=> {
        let loggedUser = auth.onAuthStateChanged(user => setUser(user));

        return loggedUser;
    }, [])

    const value = {
        signupController,
        signinController,
        logOutFunction,
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
