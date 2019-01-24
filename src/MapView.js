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

  getCities() {
    let programs = [];
    axios.get("https://zagsabroad-backend.herokuapp.com/locations").then((res) => {
      let allPrograms = res.data;
      let matchingPrograms = this.props.programs;
      for(let i = 0; i < matchingPrograms.length; i++) {
        let programInfo = allPrograms.find((program) => program.host_program === matchingPrograms[i]);
        if(programInfo) {
          programs.push(programInfo);
        } else {
          console.log("Couldn't find program");
        }
      }
      this.setState({programs: programs});
    });
  }

  componentWillReceiveProps() {
    this.getCities();
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
