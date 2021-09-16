import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Route } from '../../Context/Env';
import { AuthFunction } from '../../Context/AuthContext';
import { Form, Card, CloseButton, Badge, Button } from 'react-bootstrap';
import AsyncSelect from "react-select/async";
import { OptionTypeBase } from 'react-select';
import Link from 'next/link';

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
        result : {
            roomDescription : string,
            _id ?: string,
            roomName : string,
            owner : string,
            roomMembers ?: Array<IRoomMembers>,
            admin ?: Array<IRoomMembers>,
            createdAt : string,
            updatedAt : string
        },
        members : {
            rows : [{
                isAdmin : 1 | 0,
                label :string,
                value :number
            }] | []
        }
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
        result : {
            roomDescription : "",
            _id : "",
            roomName : "",
            owner : "",
            roomMembers : [{_id : "", username : ""}],
            admin : [{_id : "", username : ""}],
            createdAt : "",
            updatedAt : ""
        },
        members : { rows :
            []
        }
    });
    const [searchResults , setSearchResults] = useState<Array<ISearchResult>>([]);
    const [ memberUsername, setMemberUsername ] = useState<string>("");
    const [ members, setMembers ] = useState<OptionTypeBase>([]);
    const [ roomID, setRoomID ] = useState<string | string[] | undefined>();

    // use effects 
    useEffect(function(){setRoomID(history.query.roomname)}, [history])

    useEffect(function() {
        if(memberUsername == "") setSearchResults([]);
        let controller = new window.AbortController();
        fetch(`${Route.BASE_URL}/searchFriends?value=${memberUsername}&roomId=${roomID}`, {
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
    }, [memberUsername, accessToken, Route, roomID]);


    useEffect(function(){
        if(accessToken == "") return;
        if(!roomID) return;
        fetch(`${Route.BASE_URL}/getRoomInfo`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({roomId : roomID})
        }).then(res => res.json())
        .then(function(data : IRoomModel){
            setRoomModel(data);
        }).catch(err => {
            history.push('/managerooms');
        });
    }, [roomID, accessToken, Route]);

    function loadOptions(inputValue : string, callback : Function){
        callback(searchResults);
    }

    // handle saved changes
    async function handleChanges(e :any){
        e.preventDefault();
        let roomName = e.target[0].value;
        if(roomName == roomModel.result.roomName && members.rows.length == 0){
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
                members : members.rows.length == 0 ? undefined : members,
                roomName :roomName == roomModel.result.roomName ? undefined : roomName,
                roomId : roomID,
            })
        }).then(res => res.status == 200 ? location.reload() : console.log("error detected"))
        .catch(err => {});
    }

    async function handleDeleteRoom(){
        await fetch(`${Route.BASE_URL}/deleteRoom`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                roomId : roomID
            })
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
                        defaultValue = { roomModel.result.roomName }
                        className="mx-2"
                        style={{width : "20rem"}}
                    />
                </Form.Group>
                <Form.Group className={`d-flex align-items-center justify-content-between my-2`}>
                    <Form.Label>Owner</Form.Label>
                    <span>:</span>
                    <Form.Control 
                        readOnly
                        defaultValue = { roomModel.result.owner }
                        className="mx-2"
                        style={{width : "20rem"}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Group Members :</Form.Label>
                    <Card style={{width : "20rem", border: "1px solid #000"}} className={`d-flex`}>
                        <Card.Body className="py-1 d-flex justify-content-between align-items-center" style={{flexFlow:"row wrap"}}>
                            <span style={{whiteSpace :"nowrap"}} className="overflow-hidden">{roomModel.result.owner}</span>
                            <Badge bg="success">OWNER</Badge>
                            {/* <Badge bg="primary">ADMIN</Badge> */}
                        </Card.Body>
                    </Card>
                    {
                        roomModel.members && roomModel.members.rows.map(function(member, index :number){
                            if (member.label == roomModel.result.owner) return;
                            return (
                                <Card style={{width : "20rem", border: "1px solid #000"}} className={`d-flex`} key={member.value}>
                                    <Card.Body className="py-1 d-flex justify-content-between align-items-center" style={{flexFlow:"row wrap"}}>
                                        <span>{member.label}</span>
                                        <div className={`d-flex align-items-center justify-content-between`}>
                                            {member.isAdmin == 1 && <Badge bg="primary">ADMIN</Badge>}
                                            {userData?.username == member.label && <Badge bg="primary">YOU</Badge>}
                                            <CloseButton />
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })
                    }
                </Form.Group>
                <Form.Group className={`d-flex align-items-center justify-content-between my-2`}>
                    <Form.Label className="m-0">Add Members </Form.Label>
                    <span>:</span>
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
            <Link href="/managerooms">
                <Button className="my-4">Back</Button>
            </Link>
        </div>
        </div>
    )
}