import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, InputGroup, FormControl } from 'react-bootstrap';

export default function UserProfiles() {
    return (
        <>
        <Form className={`d-flex justify-content-evenly align-items-center flex-column m-2`} style={{width: "35rem"}}>
            <Form.Group className="d-flex my-2 align-items-center justify-content-center" style={{width: "100%"}}>
                <Form.Label className="m-0">Username</Form.Label>
                <span className="px-1">:</span>
                <InputGroup>
                    <InputGroup.Text>@</InputGroup.Text>
                    <FormControl id="inlineFormInputGroupUsername" placeholder="Username" type="text"/>
                </InputGroup>
            </Form.Group>
        </Form>
        </>
    )
}
