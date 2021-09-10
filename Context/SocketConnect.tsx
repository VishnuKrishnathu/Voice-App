import React, { createContext, useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import { Socket } from 'socket.io-client';
import { Route } from "./Env";

interface IProps {
    title ?: string;
    children : JSX.Element
}

const SocketProvider = createContext<{
    socket : Socket | undefined 
}>({socket : undefined});

export function SocketContext(){
    return useContext(SocketProvider);
}

export default function SocketConnect(props : IProps) {

    const [ socket, setSocket ] = useState<Socket>();

    useEffect(function() {
        const newSocket = io(`${Route.BASE_URL}`, {
            transports : ['websocket']
        });

        setSocket(newSocket);
        return function(){
            newSocket.close();
        }
    }, [])

    return (
        <SocketProvider.Provider value = {{socket}}>
            {props.children}
        </SocketProvider.Provider>
    )
};