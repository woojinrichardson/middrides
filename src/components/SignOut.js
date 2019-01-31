import React, { Component } from 'react';
import { auth, firebase } from '../firebase';
import { Menu } from 'semantic-ui-react';

class SignOutButton extends Component {
  constructor(props) {
    super(props);
  }

  handleSignOut = () => {
    if (this.props.isDispatcher) {
      const db = firebase.firebase.firestore();
      db.collection('vehicles').doc('bus').update({
        isOperating: false
      })
      .catch(error => console.log('Error updating document: ', error));
    }
    auth.signOut();
  }

  render() {
    return (
      <Menu.Item name='sign out' onClick={this.handleSignOut}>
        Sign out
      </Menu.Item>
    );
  }
}

export default SignOutButton;
