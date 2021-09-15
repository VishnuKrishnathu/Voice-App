import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Route } from '../../Context/Env';
import { AuthFunction } from '../../Context/AuthContext';
import { Form, Card, CloseButton, Badge, Button } from 'react-bootstrap';
import AsyncSelect from "react-select/async";
import { OptionTypeBase } from 'react-select';

export default function EditRoomProps() {
    const history = useRouter();
    const { accessToken } = AuthFunction();
    const { userData } = AuthFunction();

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
    const [ members, setMembers ] = useState<OptionTypeBase>([]);

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

    // handle saved changes
    async function handleChanges(e :any){
        e.preventDefault();
        let roomName = e.target[0].value;
        let roomId = history.query.roomname;
        if(roomName == roomModel.roomName && members.length == 0){
            return;
        }
        console.log(members);
        console.log("submitted");
        await fetch(`${Route.BASE_URL}/editRoom`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({
                members : members.length == 0 ? undefined : members,
                roomName :roomName == roomModel.roomName ? undefined : roomName,
                roomId
            })
        }).then(res => res.status == 200 ? location.reload() : console.log("error detected"))
        .catch(err => {});
    }

    async function handleDeleteRoom(){
        let roomId = history.query.roomname;
        await fetch(`${Route.BASE_URL}/deleteRoom`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify({roomId})
        }).then(res => {
            if(res.status == 200){
                history.push('/managerooms');
                return;
            }
        }).catch(err => console.log(err));
    }

    return (
        <div>
        <div style={{ width : "30rem" }} className="m-4">
            <Form onSubmit={handleChanges}>
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
                            <span>{ userData?.username }</span>
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
                        onChange={(val) => setMembers(val)}
                    />
                </Form.Group>
                <Button 
                    variant="success" 
                    className={`ml-2 mt-2`}
                    type= "submit"
                >Save changes</Button>
                <Button 
                    variant="danger" 
                    className={`mx-2 mt-2`}
                    onClick={handleDeleteRoom}
                >Delete room</Button>
            </Form>
        </div>
        </div>
    )
}