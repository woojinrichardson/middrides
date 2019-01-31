import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';
import { Button, Confirm } from 'semantic-ui-react';

class CancelRequestButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      error: '',
    }
  }

  show = () => this.setState({ modalOpen: true })

  handleConfirm = () => {
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
    this.setState({ modalOpen: false });
  }

  handleCancel = () => this.setState({ modalOpen: false })

  render() {
    const {
      error,
    } = this.state;

    return (
      <div>
        <Button fluid negative style={{marginTop: '20px', marginBottom: '20px'}} onClick={this.show}>Cancel Request</Button>
        <Confirm
          open={this.state.modalOpen}
          content='Are you sure you want to cancel this request?'
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
        { error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default CancelRequestButton;
