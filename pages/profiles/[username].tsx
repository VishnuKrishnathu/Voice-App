import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, InputGroup, FormControl, Table, Badge } from 'react-bootstrap';
import { AuthFunction } from '../../Context/AuthContext';
import { Route } from "../../Context/Env";

export default function UserProfiles() {
    
    interface IRoom {
        roomId : number;
        memberId : number;
        roomName : string;
        _id : string;
        isAdmin : 1 | 0;
    }
    //states
    const [rooms, setRooms] = useState<Array<IRoom>>([]);

    const { userData, accessToken } = AuthFunction();
    const history = useRouter();

    useEffect(function(){
        if(accessToken == "" || !accessToken){
            return;
        }
        let controller = new window.AbortController();
        let username = history.query.username;
        fetch(`${Route.BASE_URL}/getProfileInformation`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body : JSON.stringify({username}),
            signal : controller.signal
        }).then(function(res){
            return (res.json())
        })
        .then(function(data : {
            rooms : Array<IRoom>
        }){
            console.log(data);
            setRooms(data.rooms);
        })
        .catch(err => {});

        return function(){
            controller.abort();
        }
    }, [accessToken, history])
    return (
        <>
        <Form className={`d-flex justify-content-evenly align-items-center flex-column m-2`} style={{width: "30rem"}}>
            <Form.Group className="d-flex my-2 align-items-center justify-content-center" style={{width: "100%"}}>
                <Form.Label className="m-0">Username</Form.Label>
                <span className="px-1">:</span>
                <InputGroup>
                    <InputGroup.Text>@</InputGroup.Text>
                    <FormControl 
                        id="inlineFormInputGroupUsername" 
                        placeholder="Username" 
                        type="text"
                        value={ userData?.username }
                        readOnly
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group className={`my-2`} style={{width: "100%"}}>
                <Form.Label className="m-0">Rooms Joined :</Form.Label>
                <Table striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Room Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        rooms.length !== 0 && rooms.map((room, index) => {
                            return (
                                <tr key={room.roomId}>
                                    <td>{index+1}</td>
                                    <td className={`d-flex flex-align-center justify-content-between`}>
                                        <span>{room.roomName}</span>
                                        {
                                            room.isAdmin == 1 && <Badge 
                                                bg="primary"
                                                className={`d-flex justify-content-center align-items-center`}
                                            >
                                                Admin
                                            </Badge>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>
            </Form.Group>
        </Form>
        </>
    )
}
