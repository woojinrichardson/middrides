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
      initialState: 'pending',
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const db = firebase.firebase.firestore();
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
      if (this.state.request && !this.state.isDispatcher) {
        const db = firebase.firebase.firestore();
        db.collection('requests').doc(this.state.request.id).set(
          request,
          { merge: true }
        )
        .then(() => {
          const updatedRequest = Object.assign({}, this.state.request, request);
          this.setState({ request: updatedRequest });
        });
      } else {
        const db = firebase.firebase.firestore();
        db.collection('requests').add(
          request
        )
        .then(documentReference => {
          Object.assign(request, {id: documentReference.id });
          this.setState({ request });
        });
      }
    }
    this.setState({ mode: 'view' });
  }

  render() {
    const menu = (
      <Menu fixed='top' inverted style={{height: '60px'}}>
        <Menu.Item header style={{fontFamily: 'Helvetica', fontWeight: '500', fontSize: 'large'}}>
          Midd Rides
        </Menu.Item>
        <Menu.Menu position='right'>
          {this.state.user ? <SignOut /> : <SignIn />}
        </Menu.Menu>
      </Menu>
    );

    if (!this.state.user) {
      return (
        <div>
          {menu}
          <MapContainer />
        </div>
      );
    } else if (this.state.user) {

      const requestFormButton = (
        <Button color={this.state.isDispatcher ? 'teal' : 'blue'} fluid style={{marginTop: '20px'}} onClick={() => this.setState({ mode: 'request form' })}>
          {this.state.isDispatcher ? 'Add Ride' : 'Request Ride'}
        </Button>
      );

      const editRequestButton = (
        <Button fluid style={{marginTop: '20px'}} onClick={() => this.setState({ mode: 'request form' })}>
          Edit Request
        </Button>
      );

      if (this.state.mode === 'request form') {
        return (
          <RequestForm
            user={this.state.user.uid}
            request={this.state.isDispatcher ? null : this.state.request}
            complete={request => this.handleFormReturn(request)}
            initialState={this.state.initialState}
          />
        );
      } else if (this.state.isDispatcher) {
        return (
          <div>
            {menu}
            <Grid centered verticalAlign='middle' style={{minHeight: '100vh'}}>
              <Grid.Row>
                <Grid.Column width={13}>
                  <RequestQueue
                    addPendingRequest={() => this.setState({ mode: 'request form', initialState: 'pending' })}
                    addInProgressRrequest={() => this.setState({ mode: 'request form', initialState: 'in progress' })}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        );
      } else if (this.state.request) {
        return (
          <div>
            {menu}
            <MapContainer />
            <Grid textAlign='center'>
              <Grid.Column width={3}>
                {editRequestButton}
              </Grid.Column>
              <Grid.Column width={3}>
                <CancelRequest
                  id={this.state.request.id}
                  complete={() => this.setState({ request: null })}
                />
              </Grid.Column>
            </Grid>
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
  }
}

export default App;
