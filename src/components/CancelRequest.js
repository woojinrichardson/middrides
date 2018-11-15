import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';

class CancelRequestButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  onClick = (event) => {
    const db = firebase.firestore();
    db.collection('requests').doc(this.props.id).update({
      active: false
    })
    .then(() => {
      console.log('Document successfully deleted.');
    })
    .catch(error => {
      this.setState({ error });
    });
    event.preventDefault();
    this.props.complete();
  }

  render() {
    const {
      error,
    } = this.state;

    return (
      <div>
        <button onClick={this.onClick}>Cancel Request</button>
        { error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default CancelRequestButton;
