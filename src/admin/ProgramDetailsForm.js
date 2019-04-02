import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Geocode from "react-geocode";
import axios from 'axios';
import DropdownTextField from '../DropdownTextField.js';
import { DropzoneArea } from 'material-ui-dropzone';

const largeTextFieldStyle = {
  width: 300,
  margin: '10px'
};

const buttonStyle = {
  margin: '5px'
};

const smallDropdownStyle = {
  width: 200,
  display: 'inline-block',
  marginLeft: '10px',
  marginTop: '6px'
};

Geocode.setApiKey("AIzaSyBFPQ0cFalfg1ea0t_HIhF9NihOeztcdgY");

class ProgramDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host_program: this.props.program[0],
      city: this.props.program[1],
      program_type: this.props.program[2],
      host_url: this.props.program[3],
      application_link: this.props.program[4],
      lat: this.props.program[5],
      lng: this.props.program[6],
      orig_host_program: this.props.program[0],
      orig_host_city: this.props.program[1],
      photos: [],
    }

    this.handleChangeProgramType = this.handleChangeProgramType.bind(this);
    this.getOldPhotos(this.state.host_program);
  }

  getOldPhotos(programInfo) {
    axios.post("http://localhost:3001/populatedropzone", programInfo).then((res) => {
      console.log(res.data);
      console.log(programInfo);
    })
  }

  formIsValid() {
    // Check that all required fields are filled
    return (this.state.host_program && this.state.city && this.state.program_type);
  }

  handleChangeProgramType(selectedOption) {
    this.setState({program_type: selectedOption.value});
  }

  updateProgram(programInfo) {
    axios.post("https://zagsabroad-backend.herokuapp.com/editprogram", programInfo).then((res) => {
      if(res.data.errno) { // Error updating the program
        this.props.displayMessage("Error updating program");
      } else { // No error, program updated successfully
        this.props.displayMessage("Program updated successfully");
      }
      this.props.onClose();
    });
  }

  handleUploadImages = images => {
    for(let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
      formData.append("upload_preset", "bdbcyhiw"); // Preset name
      formData.append("api_key", "{447116233167845}"); // Cloudinary API key
      // Upload to Cloudinary, store info in database
      axios.post("https://api.cloudinary.com/v1_1/zagsabroad/image/upload", formData).then(response => {
          let url = response.data.secure_url.replace('upload', 'upload/a_exif');
          console.log(url);
          var upload = {
            "program" : this.state.host_program, "url" : url, "height" : response.data.height,
            "width": response.data.width, "survey_id" : this.state.reviewId
          }
          axios.post("https://zagsabroad-backend.herokuapp.com/adminphotos", upload).then((res) => {
            console.log(res.data);
          });
      });
    }
  }

  render() {
    return (
      <div>
        <Dialog open={true} onClose={this.props.onClose} scroll='body'>
          <DialogTitle id="simple-dialog-title"> {this.props.title} </DialogTitle>
          <div>
            <TextField required style={largeTextFieldStyle} label = "Host Program Name"
              defaultValue = {this.state.host_program}
              onChange = { (event) =>
                this.setState({host_program : event.target.value})}/>
            <div style = {smallDropdownStyle}>
              <DropdownTextField
                required={true}
                label="Program Type"
                placeholder={this.state.program_type ? this.state.program_type : ""}
                options={[{value: "Semester", label: "Semester"},
                          {value: "Short Term", label: "Short Term"}]}
                onChange={this.handleChangeProgramType}/>
            </div>
            <TextField required style={largeTextFieldStyle} label = "Location (City, Country)"
              defaultValue = {this.state.city}
              onChange = { (event) =>
                this.setState({city : event.target.value})}/>
            <TextField style={largeTextFieldStyle} label = "Host Institution Link"
              defaultValue = {this.state.host_url}
              onChange = { (event) =>
                this.setState({host_url : event.target.value})}/>
            <TextField style={largeTextFieldStyle} label = "Application Link"
              defaultValue = {this.state.application_link}
              onChange = { (event) =>
                this.setState({application_link : event.target.value})}/><br/>
            <p style={{margin: '10px'}}> Place any default photos here: </p>
            <div style={{margin: '10px'}}>
            <DropzoneArea
              acceptedFiles={["image/jpeg", "image/png"]}
              filesLimit={20}
              onChange={(photos) => {this.setState({photos: photos})}}
              dropzoneText="Drag and drop an image or click here"
              showFileNamesInPreview={true}
              maxFileSize={5000000}/>
            </div>
            <Tooltip title={!this.formIsValid() ? "Please fill out required fields" : ""} placement="top">
              <span>
                <Button variant="contained" style={buttonStyle}
                  disabled={!this.formIsValid()}
                  onClick = {(event) => {
                    let programInfo = this.state;
                    if(this.props.title === "Add Program") {
                      // Geocoding for lat and lng
                      Geocode.fromAddress(programInfo.city).then(
                        response => {
                          const { lat, lng } = response.results[0].geometry.location;
                          programInfo["lat"] = lat;
                          programInfo["lng"] = lng;
                          axios.post("https://zagsabroad-backend.herokuapp.com/addprogram", programInfo).then((res) => {
                            if(res.data.errno) { // Error adding the program
                              this.props.displayMessage("Error adding program");
                            } else { // No error, program added successfully
                              this.props.displayMessage("Program added successfully");
                            }
                            this.props.onClose();
                          });
                        },
                        error => {
                          this.props.displayMessage("Error: check that the location is correct");
                        }
                      );
                    } else if(this.props.title === "Edit Program") {
                      // If program location has changed, use geocoding for lat and lng
                      if(programInfo.city !== programInfo.orig_host_city) {
                        Geocode.fromAddress(programInfo.city).then(
                          response => {
                            const { lat, lng } = response.results[0].geometry.location;
                            programInfo["lat"] = lat;
                            programInfo["lng"] = lng;
                            this.updateProgram(programInfo);
                          },
                          error => {
                            this.props.displayMessage("Error: check that the location is correct");
                          }
                        );
                      } else {
                        this.updateProgram(programInfo);
                      }
                    }
                    console.log(this.state.photos);
                    this.handleUploadImages(this.state.photos);
                  }}>
                  Save
                </Button>
              </span>
            </Tooltip>
            <Button variant="contained" style={buttonStyle}
              onClick = {this.props.onClose}>
              Cancel
            </Button>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ProgramDetailsForm;
