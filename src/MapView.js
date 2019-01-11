import React, { Component } from 'react';
import ReactMapboxGl from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoibHRpYmJldHRzIiwiYSI6ImNqcXJuNHdwZTBvdWE0OHA2ZjJ1bHZhZXAifQ.LfESsOUlvlNnp_oh8R9ePA"
});

class MapView extends Component {

  render() {
    const programs = this.props.programList;
    return(
      <div style={{textAlign: 'left', marginLeft:'130px'}}>
        <Map
          style="mapbox://styles/mapbox/light-v9"
          containerStyle={{
            height: "500px",
            width: "1000px"
          }}
          zoom={[1]}
          center={[10, 10]}
          >
        </Map>
      </div>
    );
  }
}

export default MapView;
