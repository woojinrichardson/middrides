import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import { firebase } from '../firebase/firebase';
import { Button, Menu } from 'semantic-ui-react';

class SignInButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  onClick = (event) => {
    // const {
    //   history,
    // } = this.props;

    auth.signIn()
      .then(result => {
        const user = result.user;
        // history.push('/home');
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault();
  }

  render() {
    const {
      error,
    } = this.state;

    return (
      <Menu.Item name='sign in' onClick={this.onClick}>
        Sign in
      </Menu.Item>
    );
  }
}

export default SignInButton;
// export default withRouter(SignInPage);
