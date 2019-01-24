import React, { Component } from 'react';
import MapGL, {Marker} from 'react-map-gl';
import axios from 'axios';
import MarkerImage from "./Marker.png"
import 'mapbox-gl/dist/mapbox-gl.css';

const token = "pk.eyJ1IjoibHRpYmJldHRzIiwiYSI6ImNqcXJuNHdwZTBvdWE0OHA2ZjJ1bHZhZXAifQ.LfESsOUlvlNnp_oh8R9ePA";

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [], //all programs that will appear on the map
      viewport: {
        latitude: 10,
        longitude: 10,
        zoom: 0
      }
    }
  }

  getAllCities() {
    axios.get("https://zagsabroad-backend.herokuapp.com/locations").then((res) => {
      this.setState({programs: res.data});
    });
  }

  componentDidMount() {
    this.getAllCities();
  }

  renderMarker = (program) => {
    return(
      <Marker
          key={program.host_program}
          longitude={program.lng}
          latitude={program.lat} >
          <img src={MarkerImage} width={15} height={20} alt=""/>
      </Marker>
    );
  }

  updateViewport = (viewport) => {
    this.setState({viewport: viewport});
  }

  render() {
    const {viewport} = this.state;
    return(
      <MapGL
        {...viewport}
        width="510px"
        height="350px"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={this.updateViewport}
        mapboxApiAccessToken={token} >
        { this.state.programs.map((program) => this.renderMarker(program)) }
      </MapGL>
    );
  }
}

export default MapView;
