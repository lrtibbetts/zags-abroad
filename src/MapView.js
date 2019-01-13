import React, { Component } from 'react';
import Geocode from "react-geocode";
import MapGL, {Marker} from 'react-map-gl';
import axios from 'axios';
import MarkerImage from "./Marker.png"
import 'mapbox-gl/dist/mapbox-gl.css';
import {render} from 'react-dom';

const token = "pk.eyJ1IjoibHRpYmJldHRzIiwiYSI6ImNqcXJuNHdwZTBvdWE0OHA2ZjJ1bHZhZXAifQ.LfESsOUlvlNnp_oh8R9ePA";

Geocode.setApiKey("AIzaSyBFPQ0cFalfg1ea0t_HIhF9NihOeztcdgY");

export default class MapView extends Component {
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

    this.getCities = this.getCities.bind(this);
  }

  getCities() {
    let programs = []; // Store program name, city, latitude, and longitude
    axios.get("https://zagsabroad-backend.herokuapp.com/cities").then((res) => {
      let allPrograms = res.data;
      let matchingPrograms = this.props.programs;
      for(let i = 0; i < matchingPrograms.length; i++) {
        let programInfo = allPrograms.find((program) => program.host_program === matchingPrograms[i]);
        if(programInfo) {
          Geocode.fromAddress(programInfo.city).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              programInfo["lat"] = lat;
              programInfo["lng"] = lng;
              programs.push(programInfo);
            },
            error => {
              console.error(error);
            }
          );
        } else {
          console.log("Error: Program not found")
        }
      }
    });
    this.setState({programs: programs});
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
          <div>
            <img src={MarkerImage} width={15} height={20} alt=""/>
          </div>
      </Marker>
    );
  }

  updateViewport = (viewport) => {
    this.setState({viewport: viewport});
  }

  render() {
    const {viewport} = this.state;
    const programs = this.state.programs;
    console.log(programs);
    return(
      <div>
        <MapGL
          {...viewport}
          width="510px"
          height="350px"
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={this.updateViewport}
          mapboxApiAccessToken={token} >
          { programs.map(this.renderMarker) }
        </MapGL>
      </div>
    );
  }
}

export function renderToDom(container) {
  render(<MapView/>, container);
}
