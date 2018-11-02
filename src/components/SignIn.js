import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import { firebase } from '../firebase/firebase';

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
        this.setState({ error: error })
      })

    event.preventDefault();
  }

  render() {
    const {
      error,
    } = this.state;

    return (
      <div>
        <button onClick={this.onClick}>Google Sign-In</button>
        { error && <p>{error.message}</p>}
      </div>
    );
  }
}

export default SignInButton;
// export default withRouter(SignInPage);
