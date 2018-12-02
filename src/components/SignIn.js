import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import { firebase } from '../firebase/firebase';
import { Button } from 'semantic-ui-react';

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
      <div>
        <Button primary size='massive' onClick={this.onClick}>Sign in with Middlebury email</Button>
        { error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default SignInButton;
// export default withRouter(SignInPage);
