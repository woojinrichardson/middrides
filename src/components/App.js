import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { firebase } from '../firebase'
// import Navigation from './Navigation';
import SignIn from './SignIn';
import SignOut from './SignOut';
import RequestForm from './RequestForm';
import CancelRequest from './CancelRequest';
import RequestQueue from './RequestQueue';

// import User from './User'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      request: null,
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(user => {
      user
        ? this.setState({ user })
        : this.setState({ user: null });
    });
  }

  render() {
    let contents;
    if (this.state.request) {
      contents = (
        <div>
          <h2>Request</h2>
          <p>Name: {this.state.request.name}</p>
          <p>Number of Passengers: {this.state.request.passengers}</p>
          <p>From: {this.state.request.from}</p>
          <p>To: {this.state.request.to}</p>
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
      // console.log(this.state.user)
      // contents = (
      //   <div>
      //     <RequestForm
      //       user={this.state.user.uid}
      //       complete={request => this.setState({ request })}
      //     />
      //     <SignOut />
      //   </div>
      // );
      contents = (
        <div>
          <RequestQueue />
          <SignOut />
        </div>
      );
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
