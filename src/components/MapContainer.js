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
  lat: 44.009965,
  lng: -73.177956
  // lat: 42.520058,
  // lng: -76.511501
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
        zoom={16}
        gestureHandling='none'
        disableDefaultUI={true}
        containerStyle={containerStyle}
      >
        <Marker
          position={{lat: this.state.lat, lng: this.state.lng}}
          icon={{
              path: 'M628.88 210.65L494.39 49.27A48.01 48.01 0 0 0 457.52 32H32C14.33 32 0 46.33 0 64v288c0 17.67 14.33 32 32 32h32c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h32c17.67 0 32-14.33 32-32V241.38c0-11.23-3.94-22.1-11.12-30.73zM64 192V96h96v96H64zm96 240c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm160-240h-96V96h96v96zm160 240c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm-96-240V96h66.02l80 96H384z', // Attribution: Font Awesome by Fonticons, Inc. https://fontawesome.com/license
              anchor: new this.props.google.maps.Point(300, 300),
              fillColor: 'black',
              fillOpacity: 1.0,
              scale: 0.05,
            }}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvOrHV6khC62g8fEuiExotGDSVBBGxPOA',
})(MapContainer)
