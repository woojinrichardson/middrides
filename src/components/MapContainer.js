import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '100%',
  height: '100%'
};

const initialCenter = {
  lat: 44.0153,
  lng:-73.1673
}

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        style={style}
        initialCenter={initialCenter}
        zoom={14}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvOrHV6khC62g8fEuiExotGDSVBBGxPOA'
})(MapContainer)
