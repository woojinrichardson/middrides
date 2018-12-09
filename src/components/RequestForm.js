import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';
import { Segment, Form, Grid } from 'semantic-ui-react';

const numbers = [
  { text: '1', value: '1' },
  { text: '2', value: '2' },
  { text: '3', value: '3' },
  { text: '4', value: '4' },
  { text: '5', value: '5' },
  { text: '6', value: '6' },
  { text: '7', value: '7' },
  { text: '8', value: '8' },
  { text: '9', value: '9' },
  { text: '10', value: '10' },
  { text: '11', value: '11' },
  { text: '12', value: '12' },
  { text: '13', value: '13' },
  { text: '14', value: '14' },
];

const locations = [
  { text: 'Adirondack Circle', value: 'Adirondack Circle' },
  { text: 'Track Lot/KDR', value: 'Track Lot/KDR' },
  { text: 'E Lot', value: 'E Lot' },
  { text: 'R Lot', value: 'R Lot' },
  { text: 'T Lot', value: 'T Lot' },
  { text: 'Q Lot', value: 'Q Lot' },
  { text: 'Robert A. Jones \'59 House', value: 'Robert A. Jones \'59 House' },
  { text: 'McCullough Student Center', value: 'McCullough Student Center' },
  { text: 'Frog Hollow', value: 'Frog Hollow' },
];

class RequestForm extends Component {
  constructor(props) {
    super(props);

    const name = props.request ? props.request.name : '';
    const passengers = props.request ? props.request.passengers : '';
    const pickup = props.request ? props.request.pickup : '';
    const dropoff = props.request ? props.request.dropoff : '';

    this.state = {
      name: name,
      passengers: passengers,
      pickup: pickup,
      dropoff: dropoff,
    };
  }

  handleInput = (event, data) => {
    this.setState({
      [data.name]: data.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const request = {
      name: this.state.name,
      passengers: this.state.passengers,
      pickup: this.state.pickup,
      dropoff: this.state.dropoff,
      user: this.props.user,
      state: 'pending',
    };
    this.props.complete(request);
  }

  handleCancel = () => this.props.complete()

  isDisabled = () =>
    this.state.name === '' ||
    this.state.passengers === '' ||
    this.state.pickup === '' ||
    this.state.dropoff === '' ||
    this.state.pickup === this.state.dropoff;

  render() {
    return (
      <Grid centered verticalAlign='middle' style={{minHeight: '100vh'}}>
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment>
              <Form onSubmit={this.handleSubmit}>
                <Form.Input
                  label='Name'
                  placeholder='Name'
                  name='name'
                  value={this.state.name}
                  onChange={this.handleInput}
                />
                <Form.Select
                  label='Number of Passengers'
                  placeholder='0'
                  name='passengers'
                  options={numbers}
                  value={this.state.passengers}
                  onChange={this.handleInput}
                />
                <Form.Select
                  label='Pickup Location'
                  placeholder='Select Pickup Location'
                  name='pickup'
                  options={locations}
                  value={this.state.pickup}
                  onChange={this.handleInput}
                />
                <Form.Select
                  label='Dropoff Location'
                  placeholder='Select Dropoff Location'
                  name='dropoff'
                  options={locations}
                  value={this.state.dropoff}
                  onChange={this.handleInput}
                />
                <Form.Group inline>
                  <Form.Button primary disabled={this.isDisabled()}>Submit</Form.Button>
                  <Form.Button onClick={this.handleCancel}>Cancel</Form.Button>
                </Form.Group>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default RequestForm;
