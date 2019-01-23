import React, { Component } from 'react';
import Geocode from "react-geocode";
import MapGL, {Marker} from 'react-map-gl';
import axios from 'axios';
import MarkerImage from "./Marker.png"
import 'mapbox-gl/dist/mapbox-gl.css';

const token = "pk.eyJ1IjoibHRpYmJldHRzIiwiYSI6ImNqcXJuNHdwZTBvdWE0OHA2ZjJ1bHZhZXAifQ.LfESsOUlvlNnp_oh8R9ePA";
Geocode.setApiKey("AIzaSyBFPQ0cFalfg1ea0t_HIhF9NihOeztcdgY");

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      viewport: {
        latitude: 10,
        longitude: 10,
        zoom: 0
      }
    }
  }

  getAllCities() {
    let programs = []; // Store program name, latitude, and longitude
    axios.get("https://zagsabroad-backend.herokuapp.com/cities").then((res) => {
      let allPrograms = res.data;
      for(let i = 0; i < allPrograms.length; i++) {
        let programInfo = allPrograms[i];
        Geocode.fromAddress(programInfo.city).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;
            programInfo["lat"] = lat;
            programInfo["lng"] = lng;
            programs.push(programInfo);
        });
      }
      this.setState({programs: programs});
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
