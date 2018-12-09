import React, { Component } from 'react';
import { firebase } from '../firebase/firebase';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
};

const containerStyle = {
  width: '1280px',
  height: '570px',
  position: 'relative',
};

const initialCenter = {
  lat: 44.0153,
  lng: -73.1673
}

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    })
    db.collection('vehicles').doc('bus')
      .onSnapshot(doc => {
        const lastPosition = doc.data().lastPosition;
        this.setState({ lat: lastPosition.latitude, lng: lastPosition.longitude });
      });
  }

  render() {
    return (
      <Map
        google={this.props.google}
        style={style}
        initialCenter={initialCenter}
        zoom={14}
        disableDefaultUI={true}
        containerStyle={containerStyle}
      >
        <Marker
          position={{lat: this.state.lat, lng: this.state.lng}}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvOrHV6khC62g8fEuiExotGDSVBBGxPOA',
})(MapContainer)
