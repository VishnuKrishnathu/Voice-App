import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Route } from '../../Context/Env';
import { AuthFunction } from '../../Context/AuthContext';
import { Form, Card, CloseButton, Badge } from 'react-bootstrap';
import AsyncSelect from "react-select/async";

export default function EditRoomProps() {
    const history = useRouter();
    const { accessToken } = AuthFunction();

    const reactSelectStyles = {
        container : function(provided :any, state :any){
            return {
                ...provided,
                width : "20rem",
                margin: "0px 0.5rem"
            }
        }
    }

    // interface room Model
    interface IRoomMembers {
        _id : string,
        username : string
    }
    interface IRoomModel {
        roomDescription : string,
        _id : string,
        roomName : string,
        owner : string,
        roomMembers : Array<IRoomMembers>,
        admin : Array<IRoomMembers>,
        createdAt : string,
        updatedAt : string
    }
    interface ISearchResult {
        value : number,
        emailAddress : string,
        label: string,
        friendId : null | number,
        requestSent : null | number,
        foreignUserID : null | number
    }
    
    // states
    const [ roomModel, setRoomModel ] = useState<IRoomModel>({
        roomDescription : "",
        _id : "",
        roomName : "",
        owner : "",
        roomMembers : [{_id : "", username : ""}],
        admin : [{_id : "", username : ""}],
        createdAt : "",
        updatedAt : ""
    });
    const [searchResults , setSearchResults] = useState<Array<ISearchResult>>([]);
    const [ memberUsername, setMemberUsername ] = useState<string>("");

    useEffect(function() {
        if(memberUsername == "") setSearchResults([]);
        let controller = new window.AbortController();
        fetch(`${Route.BASE_URL}/searchFriends?value=${memberUsername}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            signal : controller.signal
        }).then(res => res.json())
        .then(function(data : { result : Array<ISearchResult>}){
            if(typeof data == "object"){
                setSearchResults(data.result);
                return;
            }
        })
        .catch(err => {});

        return (function(){
            controller.abort();
            setSearchResults([]);
        })
    }, [memberUsername, accessToken, Route]);


    useEffect(function(){
        if(accessToken == "") return;
        let roomId = history.query.roomname;
        fetch(`${Route.BASE_URL}/getRoomInfo`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({roomId})
        }).then(res => res.json())
        .then(function(data : IRoomModel){
            setRoomModel(data);
        }).catch(err => {
        });
    }, [history, accessToken, Route]);

    function loadOptions(inputValue : string, callback : Function){
        callback(searchResults);
    }

    return (
        <div>
        <div style={{ width : "30rem" }} className="m-4">
            <Form>
                <Form.Group className={`d-flex align-items-center justify-content-between my-2`}>
                    <Form.Label className="m-0">Room Name</Form.Label>
                    <span>:</span>
                    <Form.Control 
                        defaultValue = { roomModel.roomName }
                        className="mx-2"
                        style={{width : "20rem"}}
                    />
                </Form.Group>
                <Form.Group className={`d-flex align-items-center justify-content-between my-2`}>
                    <Form.Label>Owner</Form.Label>
                    <span>:</span>
                    <Form.Control 
                        readOnly
                        defaultValue = { roomModel.owner }
                        className="mx-2"
                        style={{width : "20rem"}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Group Members :</Form.Label>
                    <Card style={{width : "20rem", border: "1px solid #000"}} className={`d-flex`}>
                        <Card.Body className="py-1 d-flex justify-content-between align-items-center">
                            <span>VishnuKrishnathu</span>
                            <Badge bg="success">OWNER</Badge>
                        </Card.Body>
                    </Card>
                    {
                        roomModel.roomMembers && roomModel.roomMembers.map(function(member :IRoomMembers, index :number){
                            if (index == 0) return;
                            return (
                                <Card style={{width : "20rem", border: "1px solid #000"}} className={`d-flex`}>
                                    <Card.Body className="py-1 d-flex justify-content-between align-items-center">
                                        <span>{member.username}</span>
                                        <CloseButton />
                                    </Card.Body>
                                </Card>
                            );
                        })
                    }
                </Form.Group>
                <Form.Group className={`d-flex align-items-center justify-content-between my-2`}>
                    <Form.Label>Add Members :</Form.Label>
                    <AsyncSelect 
                        styles={reactSelectStyles}
                        loadOptions={ loadOptions }
                        isClearable={true}
                        isMulti
                        onInputChange={setMemberUsername}
                    />
                </Form.Group>
            </Form>
        </div>
        </div>
    )
}
