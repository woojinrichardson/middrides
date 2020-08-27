import React, { Component } from 'react';
import { firebase } from '../firebase'
import SignIn from './SignIn';
import SignOut from './SignOut';
import RequestForm from './RequestForm';
import CancelRequest from './CancelRequest';
import RequestQueue from './RequestQueue';
import MapContainer from './MapContainer';
import { Button, Card, Checkbox, Confirm, Container, Grid, Header, Icon, Image, Label, Menu, Modal, Segment, Table } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      request: null,
      isDispatcher: false,
      mode: 'view',
      initialState: 'pending',
      isOperating: false,
      modalOpen: false,
      confirmOpen: false,
    };
  }

  componentDidMount() {
    // check to see if Midd Rides is operating
    const db = firebase.firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    })
    db.collection('vehicles').doc('bus')
      .onSnapshot(doc => this.setState({ isOperating: doc.data().isOperating }))

    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });

        // check to see if user is dispatcher
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
                },
                {
                  enableHighAccuracy: true,
                  timeout: Infinity,
                  maximumAge: 0,
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
          .orderBy('timestamp', 'desc')
          .limit(1)
          .onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
              const request = querySnapshot.docs[0].data();
              if (request.state === 'pending' || request.state === 'in progress') {
                Object.assign(request, {id: querySnapshot.docs[0].id});
                this.setState({ request });
              } else {
                this.setState({ request: null });
              }
            }
          });
      } else {
        if (this.state.isDispatcher) {
          this.setState({ isDispatcher: false })
        }
        this.setState({ user: null })
      }
    });
  }

  handleFormReturn = request => {
    if (request) { // not a cancel
      if (this.state.request) { // editing request
        const db = firebase.firebase.firestore();
        db.collection('requests').doc(this.state.request.id).set(
          request,
          { merge: true }
        );
      } else { // new request
        const db = firebase.firebase.firestore();
        db.collection('requests').add(
          request
        );
      }
    }
    this.setState({ modalOpen: false });
  }

  handleCancel = () => {
    const db = firebase.firebase.firestore();
    db.collection('requests').doc(this.state.request.id).update({
      state: 'cancelled'
    });
    this.setState({ confirmOpen: false });
  }

  handleModalOpen = () => this.setState({ modalOpen: true })

  handleModalClose = () => this.setState({ modalOpen: false })

  handleConfirmOpen = () => this.setState({ confirmOpen: true })

  handleConfirmClose = () => this.setState({ confirmOpen: false })

  handleToggle = (event, data) => {
    const db = firebase.firebase.firestore();
    db.collection('vehicles').doc('bus').update({
      isOperating: data.checked
    })
    .catch(error => console.log('Error updating document: ', error));
  }

  render() {
    const menu = (
      <Menu inverted borderless attached='top'>
        <Container>
          <Menu.Item header style={{fontFamily: 'Roboto, sans-serif', fontSize: '1.25em'}}>
            <Icon name='bus' />
            Midd Rides
          </Menu.Item>
          <Menu.Item
            href='http://www.middlebury.edu/offices/health/publicsafety/services-we-offer/MiddRides'
            target='_blank'
          >
            Schedule
          </Menu.Item>
          <Menu.Menu position='right'>
            {this.state.user ? <SignOut isDispatcher={this.state.isDispatcher} /> : <SignIn />}
          </Menu.Menu>
        </Container>
      </Menu>
    );

    if (!this.state.user) {
      if (!this.state.isOperating) {
        return (
          <div style={{display: 'flex', flexFlow: 'column', height: '100vh', width: '100vw'}}>
            {menu}
            <div style={{flex: '2', display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(https://res.cloudinary.com/dpktscic3/image/upload/v1549926294/green-mountains-istock-OGphoto.jpg)', backgroundPosition: 'center center', backgroundRepeat: 'no repeat', backgroundAttachment: 'fixed', backgroundSize: 'cover'}}>
              <Header as='h1' textAlign='center' style={{color: 'white', fontFamily: 'Roboto, sans-serif', fontSize: '3.5em', fontWeight: 'bold'}}>Midd Rides is not running now.</Header>
              <Button
                inverted
                size='massive'
                href='http://www.middlebury.edu/offices/health/publicsafety/services-we-offer/MiddRides'
                target='_blank'
              >
                See Bus Schedule
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div style={{display: 'flex', flexFlow: 'column', height: '100vh', width: '100vw'}}>
            {menu}
            <div style={{flex: '2', position: 'relative'}}>
              <MapContainer />
            </div>
          </div>
        );
      }
    } else if (this.state.user) {
      if (this.state.isDispatcher) {
        return (
          <div>
            {menu}
            <Grid>
              <Grid.Row>
                <Grid.Column textAlign='right'>
                  <span style={{position: 'relative', bottom: '5px', marginRight: '10px'}}>Operating</span>
                  <Checkbox toggle checked={this.state.isOperating} onChange={(event, data) => this.handleToggle(event, data)} style={{marginTop: '10px', marginRight: '10px'}} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
              <Grid.Column>
                <RequestQueue
                  addPendingRequest={() => this.setState({ request: null, modalOpen: true, initialState: 'pending' })}
                  addInProgressRequest={() => this.setState({ request: null, modalOpen: true, initialState: 'in progress' })}
                  editRequest={request => this.setState({ request, modalOpen: true, initialState: request.state })}
                />
              </Grid.Column>
              </Grid.Row>
            </Grid>

            <Modal
              size='tiny'
              open={this.state.modalOpen}
              onClose={this.handleModalClose}
              closeIcon
            >
              <Modal.Header>Request a ride</Modal.Header>
              <Modal.Content>
                <RequestForm
                  user={this.state.user.uid}
                  request={this.state.request}
                  complete={request => this.handleFormReturn(request)}
                  initialState={this.state.initialState}
                />
              </Modal.Content>
            </Modal>
          </div>
        );
      } else if (!this.state.isOperating) {
        return (
          <div style={{display: 'flex', flexFlow: 'column', height: '100vh', width: '100vw'}}>
            {menu}
            <div style={{flex: '2', display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(https://res.cloudinary.com/dpktscic3/image/upload/v1549926294/green-mountains-istock-OGphoto.jpg)', backgroundPosition: 'center center', backgroundRepeat: 'no repeat', backgroundAttachment: 'fixed', backgroundSize: 'cover'}}>
              <Header as='h1' textAlign='center' style={{color: 'white', fontFamily: 'Roboto, sans-serif', fontSize: '3.5em', fontWeight: 'bold'}}>Midd Rides is not running now.</Header>
              <Button
                inverted
                size='massive'
                href='http://www.middlebury.edu/offices/health/publicsafety/services-we-offer/MiddRides'
                target='_blank'
              >
                See Bus Schedule
              </Button>
            </div>
          </div>
        );
      } else if (this.state.request) {
        return (
          <div style={{display: 'flex', flexFlow: 'column', height: '100vh', width: '100vw'}}>
            {menu}
            <div style={{flex: '2', position: 'relative'}}>
              <MapContainer />
            </div>
            <Card raised style={{position: 'absolute', top: '60px', left: '0', right: '0', margin: 'auto'}}>
              <Card.Content textAlign='center'>
                <Card.Description>
                  <b>{this.state.request.passengers}</b> {this.state.request.passengers > 1 ? 'passengers' : 'passenger'}
                </Card.Description>
                <Card.Description>
                  <b>{this.state.request.pickup}</b> to <b>{this.state.request.dropoff}</b>
                </Card.Description>
              </Card.Content>
            </Card>
            <Segment attached='bottom' textAlign='center'>
              <Button
                onClick={this.handleModalOpen}
                style={{marginRight: '15px'}}
              >
                Edit Request
              </Button>
              <Button
                negative
                onClick={this.handleConfirmOpen}
              >
                Cancel Request
              </Button>
            </Segment>

            <Modal
              size='tiny'
              open={this.state.modalOpen}
              onClose={this.handleModalClose}
              closeIcon
            >
              <Modal.Header>Request a ride</Modal.Header>
              <Modal.Content>
                <RequestForm
                  user={this.state.user.uid}
                  request={this.state.request}
                  complete={request => this.handleFormReturn(request)}
                  initialState={this.state.initialState}
                />
              </Modal.Content>
            </Modal>

            <Confirm
              open={this.state.confirmOpen}
              content='Are you sure you want to cancel this request?'
              onCancel={this.handleConfirmClose}
              onConfirm={this.handleCancel}
            />
          </div>
        );
      } else {
        return (
          <div style={{display: 'flex', flexFlow: 'column', height: '100vh', width: '100vw'}}>
            {menu}
            <div style={{flex: '2', position: 'relative'}}>
              <MapContainer />
            </div>
            <Segment attached='bottom' textAlign='center'>
              <Button
                primary
                onClick={this.handleModalOpen}
              >
                Request Ride
              </Button>
            </Segment>

            <Modal
              size='tiny'
              open={this.state.modalOpen}
              onClose={this.handleModalClose}
              closeIcon
            >
              <Modal.Header>Request a ride</Modal.Header>
              <Modal.Content>
                <RequestForm
                  user={this.state.user.uid}
                  request={this.state.request}
                  complete={request => this.handleFormReturn(request)}
                  initialState={this.state.initialState}
                />
              </Modal.Content>
            </Modal>
          </div>
        );
      }
    }
  }
}

// <Menu.Item name='home'>
//   Home
// </Menu.Item>
// <Menu.Item name='schedule'>
//   Schedule
// </Menu.Item>

// <Container>
//   <Header as='h1' textAlign='center'>Midd Rides is not running now.</Header>
//   <Header>Hours of Operation</Header>
//   <Table basic='very'>
//     <Table.Body>
//       <Table.Row>
//       </Table.Row>
//       <Table.Row>
//         <Table.Cell>Sunday - Thursday</Table.Cell>
//         <Table.Cell>7:30 p.m. - 1:30 a.m.</Table.Cell>
//       </Table.Row>
//       <Table.Row>
//         <Table.Cell>Friday & Saturday</Table.Cell>
//         <Table.Cell>8:30 p.m. - 2:30 a.m.</Table.Cell>
//       </Table.Row>
//     </Table.Body>
//   </Table>
//   <p>Not in operation during summer term and college breaks (Thanksgiving Break, Holiday Break, Winter Break, and Spring Break).</p>
// </Container>



export default App;
