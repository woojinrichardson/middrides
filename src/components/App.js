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
import MapContainer from './MapContainer';
import { Button, Grid, Menu } from 'semantic-ui-react';

// import User from './User'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      request: null,
      isDispatcher: false,
      mode: 'view',
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
          if (isDispatcher) {
            if ('geolocation' in navigator) {
              const watchID = navigator.geolocation.watchPosition(
                position => {
                  db.collection('vehicles').doc('bus').update({
                    lastPosition: new firebase.firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)
                  })
                  .then(() => console.log('Document successfully updated!'))
                  .catch(error => console.log('Error updating document: ', error));
                },
                error => {
                  alert('ERROR(' + error.code + '): ' + error.message);
                }
              );
            } else {
              console.log('Geolocation not available.');
            }
          }
          this.setState({ isDispatcher });
        })
        .catch(error => console.log(error));

        db.collection('requests')
        .where('user', '==', user.uid)
        .where('state', '==', 'pending')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const request = querySnapshot.docs[0].data();
            Object.assign(request, {id: querySnapshot.docs[0].id});
            this.setState({ request });
          }
        })
        .catch(error => console.log(error));

        db.collection('requests')
        .where('user', '==', user.uid)
        .where('state', '==', 'in progress')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const request = querySnapshot.docs[0].data();
            Object.assign(request, {id: querySnapshot.docs[0].id});
            this.setState({ request });
          }
        })
        .catch(error => console.log(error));
      } else {
        this.setState({ user: null });
      }
    });
  }

  handleFormReturn = request => {
    if (request) {
      const db = firebase.firebase.firestore();
      db.collection('requests').add(
        request
      )
      .then(documentReference => {
        Object.assign(request, {id: documentReference.id });
        this.setState({ request });
      });
    }
    this.setState({ mode: 'view' });
  }

// <h1 style={{fontSize: '100px', fontWeight: '1'}}>Midd Rides</h1>

  render() {
    if (!this.state.user) {
      return (
        <Grid textAlign='center' verticalAlign='middle' style={{minHeight: '100vh'}}>
          <Grid.Row>
            <Grid.Column>
              <SignIn />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else if (this.state.user) {

      const requestFormButton = (
        <Button primary fluid style={{marginTop: '15px'}}onClick={() => this.setState({ mode: 'request form' })}>
          {this.state.isDispatcher ? 'Add Ride' : 'Request Ride'}
        </Button>
      );

      const menu = (
        <Menu>
          <Menu.Menu position='right'>
            <SignOut />
          </Menu.Menu>
        </Menu>
      );

      if (this.state.mode === 'request form') {
        return (
          <RequestForm
            user={this.state.user.uid}
            complete={request => this.handleFormReturn(request)}
          />
        );
      } else if (this.state.isDispatcher) {
        return (
          <div>
            <RequestQueue />
            {requestFormButton}
            <SignOut />
          </div>
        );
      } else if (this.state.request) {
        return (
          <div>
            {menu}
            <MapContainer />
            <CancelRequest
              id={this.state.request.id}
              complete={() => this.setState({ request: null })}
            />
          </div>
        );
      } else {
        return (
          <div>
            {menu}
            <MapContainer />
            <Grid textAlign='center'>
              <Grid.Column width={3}>
                {requestFormButton}
              </Grid.Column>
            </Grid>

          </div>
        );
      }
    }


    // let contents;
    // if (this.state.user && this.state.request) {
    //   contents = (
    //     <div>
    //       <UserRequest
    //         request={this.state.request}
    //       />
    //       <RequestForm
    //         complete={request => this.setState({ request })}
    //       />
    //       <CancelRequest
    //         id={this.state.request.id}
    //         complete={() => this.setState({ request: null })}
    //       />
    //       <SignOut />
    //     </div>
    //   );
    // } else if (this.state.user) {
    //     if (this.state.isDispatcher) {
    //       console.log('hi');
    //
    //       if ('geolocation' in navigator) {
    //
    //         const watchID = navigator.geolocation.watchPosition(
    //           position => {
    //             const db = firebase.firebase.firestore();
    //             db.collection('vehicles').doc('bus').update({
    //               lastPosition: position
    //             })
    //             .then(() => console.log('Document successfully updated!'))
    //             .catch(error => console.log('Error updating document: ', error));
    //           },
    //           error => {
    //             alert('ERROR(' + error.code + '): ' + error.message);
    //           }
    //         );
    //       } else {
    //         console.log('Geolocation not available.')
    //         /* geolocation IS NOT available */
    //       }
    //
    //       contents = (
    //         <div>
    //           <RequestQueue />
    //           <SignOut />
    //         </div>
    //       );
    //     } else {
    //       contents = (
    //         <div>
    //           <RequestForm
    //             user={this.state.user.uid}
    //             complete={request => this.setState({ request })}
    //           />
    //           <SignOut />
    //         </div>
    //       );
    //     }
    // }
    //
    // const isSignedIn = this.state.user;
    // if (isSignedIn) {
    //   return (
    //     <div>
    //       {contents}
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div>
    //       <SignIn />
    //       <MapContainer />
    //     </div>
    //
    //   );
    // }

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
