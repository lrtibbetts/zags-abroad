import React, { Component } from 'react';
import MapGL, {Marker, Popup} from 'react-map-gl';
import axios from 'axios';
import MarkerImage from "./Marker.png"
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link } from "react-router-dom";

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
      },
      popupInfo: null
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
    this.setState({popupInfo: null}, this.getCities());
  }

  //Resource: https://github.com/uber/react-map-gl/blob/4.0-release/examples/controls/src/app.js
  renderPopup() {
    const {popupInfo} = this.state;
    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.lng}
        latitude={popupInfo.lat}
        closeOnClick={false}
        onClose={() => this.setState({popupInfo: null})} >
        <Link to={`/program/${this.state.popupInfo.host_program}`} target="_blank"
        style={{color: 'black'}}>
        {this.state.popupInfo.host_program}</Link>
      </Popup>
    );
  }

  renderMarker = (program) => {
    if(this.state.programs.find((otherProgram) => otherProgram !== program &&
    otherProgram.lng === program.lng && otherProgram.lat === program.lat)) {
      // Multiple programs in same place. Offset current program slightly
      program.lng += 0.001;
      program.lat += 0.001;
    }
    return(
      <Marker
          key={program.host_program}
          longitude={program.lng}
          latitude={program.lat}
          offsetTop={-15}
          offsetLeft={-7}>
          <img src={MarkerImage} width={15} height={20} alt=""
          onClick={() => this.setState({popupInfo: program})}/>
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
        width= "100%"
        height= "100%"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={this.updateViewport}
        mapboxApiAccessToken={token} >
        { this.state.programs.map((program) => this.renderMarker(program)) }
        {this.renderPopup()}
      </MapGL>
    );
  }
}

export default MapView;
