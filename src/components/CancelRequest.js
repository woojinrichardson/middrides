import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';
import { Button } from 'semantic-ui-react';

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
      state: 'cancelled'
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
        <Button fluid negative style={{marginTop: '20px'}} onClick={this.onClick}>Cancel Request</Button>
        { error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default CancelRequestButton;
