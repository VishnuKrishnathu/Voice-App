import styles from "../styles/Navbar.module.css";
import { useState, useEffect } from "react";
import { Route } from '../Context/Env';
import Image from 'next/image';
import userAdd from '../public/useradd.svg';
import { Button } from 'react-bootstrap';

export default function Searchbar(props : {token : string | undefined}) {
    interface IResult {
        primaryUserId : number,
        emailAddress : string,
        username: string,
        friendId : null | number,
        requestSent : null | number,
        foreignUserID : null | number
    }

    interface ISearchArr {
        result : Array<IResult>
    }

    const [regExUsername, setRegExUsername] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Array<IResult>>([]);
    const [friendRequestStatus, setFriendRequestStatus] = useState<boolean>(false);

    useEffect(function () {
        setSearchResults([]);
        let controller = new window.AbortController();
        if(regExUsername == "" || (!props.token)) {
            setSearchResults([]);
            return;
        };

        fetch(`${Route.BASE_URL}/getUsernames?value=${regExUsername}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`,
            },
            signal : controller.signal
        }).then(res => res.json())
        .then((data : ISearchArr) => {
            console.log(data);
            setSearchResults(data.result)
        })
        .catch(err => {});
        return function(){
            // controller.abort();
        }
    }, [regExUsername, friendRequestStatus]);

    function handleFriendRequest(username : string){
        return function(){
            fetch(`${Route.BASE_URL}/sendFriendRequest`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`
                },
                body : JSON.stringify({
                    username
                })
            }).then(res => res.json())
            .then((data : {
                message :string;
                requestSent :boolean;
            }) => {
                setFriendRequestStatus(data.requestSent);
            })
            .catch(err => {console.log(err)});
        };
    }

    function handleAcceptRequest(friendId : number){
        return function(){
            fetch(`${Route.BASE_URL}/acceptRequest`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${props.token}`
                },
                body : JSON.stringify({friendId})
            }).then(res => res.json()).
            then(data => {
                setFriendRequestStatus(prev => !prev);
            }).catch(err => {console.log(err)});
        };
    }
    return (
        <div className={styles.searchbar }>
                <input 
                    type="text" 
                    id="searchbar" 
                    name="searchbar" 
                    className="rounded"
                    onChange={(e) => setRegExUsername(e.target.value)}
                    autoComplete = "off"
                />
                <div style={{position: "absolute", background: "#fff"}}>
                    {
                        searchResults.length !== 0 && searchResults.map((result :IResult, index: number) => {
                            if (index >= 10) return ;
                            let checkedImage = "https://s2.svgbox.net/materialui.svg?ic=check&color=000";
                            return (
                                <div
                                    style={{width: "30vw", borderBottom: "1px solid #000", cursor: "pointer"}} 
                                    className={`py-1 px-2 d-flex align-items-center justify-content-between ${styles.search_results}`}
                                >
                                    {result.username}
                                    { !result.friendId && !result.requestSent && !result.foreignUserID && 
                                    <Button 
                                        className={`d-flex justify-content-center align-items-center`}
                                        onClick={ handleFriendRequest(result.username) }
                                    >
                                        <Image src={ userAdd }/>
                                    </Button>}
                                    {
                                        result.foreignUserID && result.primaryUserId !== result.foreignUserID && result.requestSent == 1 && 
                                        <Button 
                                            disabled={true}
                                            className={`d-flex justify-content-center align-items-center`}
                                        >
                                            <Image loader={() => checkedImage} src={ checkedImage } width="18" height="18" />
                                        </Button>
                                    }
                                    {
                                        result.foreignUserID && result.primaryUserId == result.foreignUserID && result.requestSent == 1 &&
                                        <Button
                                            className={`d-flex justify-content-center align-items-center`}
                                            onClick={ handleAcceptRequest(result.primaryUserId) }
                                        >
                                            Accept request
                                        </Button>
                                    }
                                    {
                                        result.foreignUserID && result.primaryUserId && result.foreignUserID && result.requestSent == 0 &&
                                        <Button
                                            className={`d-hidden`}
                                            disabled = { true }
                                        >
                                            View Profile
                                        </Button>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
        </div>
    )
}
