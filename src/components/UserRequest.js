import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class UserRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: this.props.request,
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    db.collection('requests')
    .where('user', '==', this.props.user)
    .where('state', '==', 'pending')
    .get()
    .then(querySnapshot => {
      if (!querySnapshot.empty) {
        const request = querySnapshot.docs[0].data();
        Object.assign(request, {id: querySnapshot.docs[0].id});
        this.props.complete(request);
      }
    })
    .catch(error => console.log(error));

    db.collection('requests')
    .where('user', '==', this.props.user)
    .where('state', '==', 'in progress')
    .get()
    .then(querySnapshot => {
      if (!querySnapshot.empty) {
        const request = querySnapshot.docs[0].data();
        Object.assign(request, {id: querySnapshot.docs[0].id});
        this.props.complete(request);
      }
    })
    .catch(error => console.log(error));
  }

  render() {
    if (this.props.request) {
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
    return null;
  }
}

export default UserRequest;
