import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      passengers: '',
      from: '',
      to: '',
    };
  }

  handleInput = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  addRequest = event => {
    event.preventDefault();
    const db = firebase.firestore();
    const request = {
      name: this.state.name,
      passengers: this.state.passengers,
      from: this.state.from,
      to: this.state.to,
      user: this.props.user,
      state: 'pending',
    }
    db.collection('requests').add(
      request
    )
    .then(documentReference => {
      Object.assign(request, {id: documentReference.id });
      this.props.complete(request)
    });
  }

  render() {
    return (
      <form onSubmit={this.addRequest}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={this.handleInput}
          value={this.state.name}
        />
        <input
          type="text"
          name="passengers"
          placeholder="Number of Passengers"
          onChange={this.handleInput}
          value={this.state.passengers}
        />
        <input
          type="text"
          name="from"
          placeholder="From"
          onChange={this.handleInput}
          value={this.state.from}
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          onChange={this.handleInput}
          value={this.state.to}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default RequestForm;
