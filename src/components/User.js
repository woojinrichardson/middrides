import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class User extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
  }

  handleInput = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  addUser = event => {
    event.preventDefault();
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    })
    db.collection('users').add({
      name: this.state.name,
      email: this.state.email
    })
    this.setState({
      name: '',
      email: '',
    })
  }

  render() {
    return (
      <form onSubmit={this.addUser}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={this.handleInput}
          value={this.state.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={this.handleInput}
          value={this.state.email}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default User;
