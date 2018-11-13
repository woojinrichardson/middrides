import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class RequestQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
    };
  }

  componentDidMount() {
    const requests = [];
    const db = firebase.firestore();
    db.collection('requests').where('state', '==', 'pending').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        requests.push(
          Object.assign({}, { id: doc.id }, doc.data())
        );
      })
      this.setState({ requests });
    });
    db.collection('requests').where('state', '==', 'in progress').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        requests.push(
          Object.assign({}, { id: doc.id }, doc.data())
        );
      })
      this.setState({ requests });
    });
  }

  cancelRequest = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'cancelled'
    })
    .then(() => {
      const requests = this.state.requests.filter(request => request.id !== id);
      this.setState({ requests })
    });
    event.preventDefault();
  }

  makeInProgress = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'in progress'
    })
    .then(() => {
      const updatedRequests = this.state.requests.map(request => {
        if (request.id === id) {
          return Object.assign({}, request, {state: 'in progress'})
        }
        return request
      });
      this.setState({ requests: updatedRequests })
    });
    event.preventDefault();
  }

  makeSatisfied = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'satisfied'
    })
    .then(() => {
      const updatedRequests = this.state.requests.filter(request => request.id !== id);
      this.setState({ requests: updatedRequests })
    });
    event.preventDefault();
  }

  render() {
    if (this.state.requests) {
      const pendingRequests = this.state.requests.filter(request => request.state === 'pending');
      const inProgressRequests = this.state.requests.filter(request => request.state === 'in progress');
      return (
        <div>
          <table>
            <caption><b>Pending Requests</b></caption>
            <tbody>
              {pendingRequests.map(request => (
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
            </tbody>
          </table>
          <br/>
          <table>
            <caption><b>In Progress Requests</b></caption>
            <tbody>
              {inProgressRequests.map(request => (
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
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  }
}

export default RequestQueue;
