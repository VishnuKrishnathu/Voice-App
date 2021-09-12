import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from "../styles/Chatroom.module.css";

interface IUserModel {
    emailId ?: string;
    password ?: string;
    username ?: string;
}

// message data interface
interface IMessage {
    sender : string;
    message : string;
    messageId : number;
}

export default function ChatArea(props : {
    values : {
        messages : Array<IMessage>;
        userData ?: IUserModel;
    }
}) {
    const [elementHeight, setElementHeight] = useState<number>(200);
    const { messages, userData } = props.values;

    const divHeight = useRef<HTMLDivElement>(null);
    const scrollBar = useRef<Scrollbars>(null);

    useEffect(() => {
        setElementHeight(function(prev : number) {
            if(!divHeight.current) return 200;
            return divHeight.current.clientHeight;
        });
    }, [divHeight, messages]);

    useEffect(() => {
        scrollBar.current?.scrollToBottom();
    }, [messages])

    return (
        <div style={{
            flexGrow : 1,
        }} className={`d-flex`} ref={divHeight}>
            <Scrollbars
                autoHeight
                autoHeightMin ={ elementHeight }
                autoHeightMax ={ elementHeight }
                style={{height : elementHeight}}
                ref={scrollBar}
            >
                <div className={`${styles.log} d-flex flex-column`} style={{
                    height: "100%"
                }}>
                {
                    messages.map(( message :IMessage) => {
                        if(message.message !== ""){
                        return(
                                <div className={`${styles.messageBox}`} style={
                                    message.sender == userData?.username ? {} : {background: "#d2d2d2"}
                                }>
                                <span className={`${styles.meta}`}>
                                    <span className={`${styles.badges}`}>
                                    </span>
                                    <span className={`${styles.name} ${message.sender == userData?.username && styles.wrapper}`}>{message.sender}</span>
                                    <i className={`${styles.metaBG}`}></i>
                                </span>

                                <span className={`${styles.message}`}>{message.message}</span>
                                </div>
                            
                        )
                        }
                    })
                }
                </div>
            </Scrollbars>
        </div>
    )
}
