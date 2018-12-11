import React, { Component } from 'react';
import { firebase } from '../firebase'
import SignIn from './SignIn';
import SignOut from './SignOut';
import RequestForm from './RequestForm';
import CancelRequest from './CancelRequest';
import RequestQueue from './RequestQueue';
import MapContainer from './MapContainer';
import { Button, Grid, Menu, Card } from 'semantic-ui-react';

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

        // check to see if user is dispatcher
        const db = firebase.firebase.firestore();
        db.collection('users').doc(user.uid).get()
        .then(doc => {
          const isDispatcher = doc.data().role === 'dispatcher';
          if (isDispatcher) {

            // update position of the bus in real time
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

        // check for existing request made by user
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
    if (request) { // not a cancel

      // dispatcher should not continually update same request when trying to make multiple requests
      if (this.state.request && !this.state.isDispatcher) { // editing request
        const db = firebase.firebase.firestore();
        db.collection('requests').doc(this.state.request.id).set(
          request,
          { merge: true }
        )
        .then(() => {
          const updatedRequest = Object.assign({}, this.state.request, request);
          this.setState({ request: updatedRequest });
        });
      } else { // new request
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
        <Button
          primary
          fluid
          style={{marginTop: '20px'}}
          onClick={() => this.setState({ mode: 'request form' })}
        >
          Request Ride
        </Button>
      );

      const editRequestButton = (
        <Button
          fluid
          style={{marginTop: '20px'}}
          onClick={() => this.setState({ mode: 'request form' })}
        >
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
                    addInProgressRequest={() => this.setState({ mode: 'request form', initialState: 'in progress' })}
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
            <Card raised style={{position: 'absolute', top: '55px', left: '500px'}}>
              <Card.Content textAlign='center'>
                <Card.Description>
                  <b>{this.state.request.passengers}</b> {this.state.request.passengers > 1 ? 'passengers' : 'passenger'}
                </Card.Description>
                <Card.Description>
                  <b>{this.state.request.pickup}</b> to <b>{this.state.request.dropoff}</b>
                </Card.Description>
              </Card.Content>
            </Card>
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
