import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class RequestQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingRequests: null,
      inProgressRequests: null,
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    db.collection('requests').where('state', '==', 'pending')
    .onSnapshot(querySnapshot => {
      const pendingRequests = [];
      querySnapshot.forEach(doc => {
        pendingRequests.push(
          Object.assign({}, { id: doc.id }, doc.data())
        );
      })
      this.setState({ pendingRequests });
    });
    db.collection('requests').where('state', '==', 'in progress')
    .onSnapshot(querySnapshot => {
      const inProgressRequests = [];
      querySnapshot.forEach(doc => {
        inProgressRequests.push(
          Object.assign({}, { id: doc.id }, doc.data())
        );
      })
      this.setState({ inProgressRequests });
    });
  }

  cancelRequest = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'cancelled'
    })
    .then(() => {
      // const pendingRequests = this.state.pendingRequests.filter(request => request.id !== id);
      // const inProgressRequests = this.state.inProgressRequests.filter(request => request.id !== id);
      // this.setState({ pendingRequests, inProgressRequests })
    });
    event.preventDefault();
  }

  makeInProgress = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'in progress'
    })
    .then(() => {
      // const oldRequest = this.state.pendingRequests.find(request => request.id === id);
      // const pendingRequests = this.state.pendingRequests.filter(request => request.id === id);
      // const inProgressRequests = this.state.inProgressRequests.slice().push(
      //   Object.assign({}, oldRequest, {state: 'in progress'})
      // );
      // this.setState({ pendingRequests, inProgressRequests });
    });
    event.preventDefault();
  }

  makeSatisfied = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'satisfied'
    })
    .then(() => {
      // const inProgressRequests = this.state.inProgressRequests.filter(request => request.id !== id);
      // this.setState({ inProgressRequests })
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <table>
          <caption><b>Pending Requests</b></caption>
          {this.state.pendingRequests && <tbody>
            {this.state.pendingRequests.map(request => (
              <tr key={request.user}>
                <td>{request.name}</td>
                <td>{request.passengers}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <button onClick={event => this.makeInProgress(event, request.id)}>
                Pick Up
                </button>
                <button onClick={event => this.cancelRequest(event, request.id)}>
                Cancel Request
                </button>
              </tr>
            ))}
          </tbody>}
        </table>
        <br/>
        <table>
          <caption><b>In Progress Requests</b></caption>
          {this.state.inProgressRequests && <tbody>
            {this.state.inProgressRequests.map(request => (
              <tr key={request.user}>
                <td>{request.name}</td>
                <td>{request.passengers}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <button onClick={event => this.makeSatisfied(event, request.id)}>
                Drop Off
                </button>
                <button onClick={event => this.cancelRequest(event, request.id)}>
                Cancel Request
                </button>
              </tr>
            ))}
          </tbody>}
        </table>
      </div>
    );
  }
}

export default RequestQueue;
