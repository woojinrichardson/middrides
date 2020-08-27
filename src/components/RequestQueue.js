import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';
import { Container, Button, Header, Table, Confirm } from 'semantic-ui-react';

class RequestQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingRequests: [],
      inProgressRequests: [],
      modalOpen: false,
      requestToCancel: null,
    };
  }

  componentDidMount() {
    // Cloud Firestore does not support logical OR queries.
    // Documentation recommends creating a separate query for each OR condition
    // and merging the query results in the app.
    // https://firebase.google.com/docs/firestore/query-data/queries
    const db = firebase.firestore();
    db.collection('requests')
      .where('state', '==', 'pending')
      .orderBy('timestamp')
      .onSnapshot(querySnapshot => {
        const pendingRequests = [];
        querySnapshot.forEach(doc => {
          pendingRequests.push(
            Object.assign({}, { id: doc.id }, doc.data())
          );
        })
        this.setState({ pendingRequests });
      });

    db.collection('requests')
      .where('state', '==', 'in progress')
      .orderBy('timestamp')
      .onSnapshot(querySnapshot => {
        const inProgressRequests = [];
        querySnapshot.forEach(doc => {
          inProgressRequests.push(
            Object.assign({}, { id: doc.id }, doc.data())
          );
        })
        this.setState({ inProgressRequests });
      });
  }

  cancelRequest = request => this.setState({ modalOpen: true, requestToCancel: request })

  makeInProgress = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'in progress'
    });
    event.preventDefault();
  }

  makeSatisfied = (event, id) => {
    const db = firebase.firestore();
    db.collection('requests').doc(id).update({
      state: 'satisfied'
    });
    event.preventDefault();
  }

  handleConfirm = () => {
    const db = firebase.firestore();
    db.collection('requests').doc(this.state.requestToCancel.id).update({
      state: 'cancelled'
    });
    this.setState({ modalOpen: false });
  }

  handleCancel = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Container>
        <Header>Pending</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Number of Passengers</Table.HeaderCell>
              <Table.HeaderCell>Pickup Location</Table.HeaderCell>
              <Table.HeaderCell>Dropoff Location</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.pendingRequests.map(request => (
              <Table.Row>
                <Table.Cell>{request.name}</Table.Cell>
                <Table.Cell>{request.passengers}</Table.Cell>
                <Table.Cell>{request.pickup}</Table.Cell>
                <Table.Cell>{request.dropoff}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <Button primary onClick={event => this.makeInProgress(event, request.id)}>Pick Up</Button>
                  <Button basic onClick={event => this.props.editRequest(request)}>Edit</Button>
                  <Button onClick={event => this.cancelRequest(request)}>Cancel</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='5' textAlign='left'>
                <Button primary onClick={this.props.addPendingRequest}>
                  Add Request
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

        <Header>In Progress</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Number of Passengers</Table.HeaderCell>
              <Table.HeaderCell>Pickup Location</Table.HeaderCell>
              <Table.HeaderCell>Dropoff Location</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.inProgressRequests.map(request => (
              <Table.Row>
                <Table.Cell>{request.name}</Table.Cell>
                <Table.Cell>{request.passengers}</Table.Cell>
                <Table.Cell>{request.pickup}</Table.Cell>
                <Table.Cell>{request.dropoff}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <Button primary onClick={event => this.makeSatisfied(event, request.id)}>Drop Off</Button>
                  <Button basic onClick={event => this.props.editRequest(request)}>Edit</Button>
                  <Button onClick={event => this.cancelRequest(request)}>Cancel</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='5' textAlign='left'>
                <Button primary onClick={this.props.addInProgressRequest}>
                  Add Request
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

        <Confirm
          open={this.state.modalOpen}
          content='Are you sure you want to cancel this request?'
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </Container>
    );
  }
}

export default RequestQueue;
