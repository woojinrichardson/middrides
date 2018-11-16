import React from 'react';

const UserRequest = props => (
  <div>
    <h2>Request</h2>
    <p>Name: {props.request.name}</p>
    <p>Number of Passengers: {props.request.passengers}</p>
    <p>From: {props.request.from}</p>
    <p>To: {props.request.to}</p>
  </div>
);

export default UserRequest;
