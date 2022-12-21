import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    onClick={props?.onClick}
    defaultCenter={{ lat: props?.lat, lng: props?.lng }}
    defaultZoom={13}>
    <Marker position={{ lat: props?.lat, lng: props?.lng }} />
  </GoogleMap>
));

export default function Map(props){
  return (
    <div style={{overflow: 'scroll'}}>
      <GoogleMapExample
        {...props}
        containerElement={ <div style={{ height: `450px`, width: '680px' }} /> }
        mapElement={ <div style={{ height: `100%` }} /> } />
    </div>
  );
}