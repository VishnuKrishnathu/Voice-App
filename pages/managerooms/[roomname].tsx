import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Route } from '../../Context/Env';
import { AuthFunction } from '../../Context/AuthContext';
import { Form, Card } from 'react-bootstrap';

export default function EditRoomProps() {
    const history = useRouter();
    const { accessToken } = AuthFunction();

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
            console.log(err);
        });
    }, [history, accessToken, Route]);

    useEffect(() => {
        console.log(roomModel);
    }, [roomModel])

    return (
        <>
        <div style={{ width : "30rem" }}>
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
                    <Card style={{width : "20rem", border: "1px solid #000"}}>
                        <Card.Body className="py-1">VishnuKrishnathu</Card.Body>
                    </Card>
                </Form.Group>
            </Form>
        </div>
        </>
    )
}
