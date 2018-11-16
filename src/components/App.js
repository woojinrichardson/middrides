import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { firebase } from '../firebase'
// import Navigation from './Navigation';
import SignIn from './SignIn';
import SignOut from './SignOut';
import RequestForm from './RequestForm';
import CancelRequest from './CancelRequest';
import RequestQueue from './RequestQueue';
import UserRequest from './UserRequest';

// import User from './User'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      request: null,
      isDispatcher: false,
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const db = firebase.firebase.firestore();
        db.settings({
          timestampsInSnapshots: true
        })
        db.collection('users').doc(user.uid).get()
        .then(doc => {
          const isDispatcher = doc.data().role === 'dispatcher';
          this.setState({ isDispatcher });
        })
        .catch(error => console.log(error));
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    let contents;
    if (this.state.request) {
      contents = (
        <div>
          <UserRequest
            request={this.state.request}
          />
          <RequestForm
            complete={request => this.setState({ request })}
          />
          <CancelRequest
            id={this.state.request.id}
            complete={() => this.setState({ request: null })}
          />
          <SignOut />
        </div>
      );
    } else if (this.state.user) {
        if (this.state.isDispatcher) {
          contents = (
            <div>
              <RequestQueue />
              <SignOut />
            </div>
          );
        } else {
          contents = (
            <div>
              <RequestForm
                user={this.state.user.uid}
                complete={request => this.setState({ request })}
              />
              <SignOut />
            </div>
          );
        }
    }

    const isSignedIn = this.state.user;
    if (isSignedIn) {
      return (
        <div>
          {contents}
        </div>
      );
    } else {
      return (
        <SignIn />
      );
    }

    // return (
    //   <div>
    //     {button}
    //   </div>
    //   // <Router>
    //   //   <div>
    //   //     <Route path="/signin" component={SignIn} />
    //   //     <Route path="/home" component={SignOut} />
    //   //     <Redirect from="/" to="/signin" />
    //   //   </div>
    //   // </Router>
    // );
  }
}

export default App;
