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
    let requests = [];
    const db = firebase.firestore();
    db.collection('requests').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        requests.push(
          Object.assign({}, { id: doc.id }, doc.data())
        );
      })
      this.setState({ requests });
    });
  }

  deleteRequest = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      active: false
    })
    .then(() => {
      const requests = this.state.requests.filter(request => request.id !== id);
      this.setState({ requests })
    });
    event.preventDefault();
  }

  render() {
    if (this.state.requests) {
      return (
        <table>
          <tbody>
            {this.state.requests.map(request => (
              <tr key={request.user}>
                <td>{request.name}</td>
                <td>{request.passengers}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <button onClick={event => this.deleteRequest(event, request.id)}>
                Cancel Request
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  }
}

export default RequestQueue;
