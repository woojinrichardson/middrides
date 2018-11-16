import React, { Component } from 'react';

class UserRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: null,
    };
  }

  render() {
    return (
      <div>
        <h2>Request</h2>
        <p>Name: {this.props.request.name}</p>
        <p>Number of Passengers: {this.props.request.passengers}</p>
        <p>From: {this.props.request.from}</p>
        <p>To: {this.props.request.to}</p>
      </div>
    );
  }

}

export default UserRequest;
