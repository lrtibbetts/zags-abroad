import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';
//import MultiDropdownTextField from './MultiDropdownTextField.js';

const largeTextFieldStyle = {
  width: 300,
  margin: '10px'
};

const mediumTextFieldStyle = {
  width: 250,
  margin: '10px'
};

const smallTextFieldStyle = {
  width: 150,
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

const largeDropDownStyle = {
  width: 325,
  display: 'inline-block',
  margin: '10px'
};

class ProgramDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host_program: this.props.program[0],
      program_types: this.props.program[2],
      host_url: this.props.program[4],
      application_link: this.props.program[3],
      city: this.props.program[1],
      lat: 0.0,
      lng: 0.0
    }

    this.handleChangeProgramType = this.handleChangeProgramType.bind(this);
  }

  formIsValid() {
    // Check that all required fields are filled
    return (this.state.host_program && this.state.host_url && this.state.city &&
    this.state.application_link && this.state.program_type);
  }

  handleChangeProgramType(selectedOption) {
    this.setState({program_type: selectedOption.value});
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div>
        <Dialog open={true} onClose={this.props.onClose} scroll='body'>
          <DialogTitle id="simple-dialog-title"> {this.props.title} </DialogTitle>
          <div>
            <TextField style={largeTextFieldStyle} label = "Host Program Name"
              defaultValue = {this.state.host_program}
              onChange = { (event) =>
                this.setState({host_program : event.target.value})}/>
            <div style = {smallDropdownStyle}>
              <DropdownTextField
                required={true}
                label="Program Type"
                placeholder={this.state.program_type ? this.state.program_type : ""}
                options={[{value: "Semester", label: "Semester"},
                          {value: "Faculty Led", label: "Faculty Led"}]}
                onChange={this.handleChangeProgramType}/>
            </div>
            <TextField required style={largeTextFieldStyle} label = "Location"
              defaultValue = {this.state.city}
              onChange = { (event) =>
                this.setState({city : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Host Institution Link"
              defaultValue = {this.state.host_url}
              onChange = { (event) =>
                this.setState({host_url : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Application Link"
              defaultValue = {this.state.application_link}
              onChange = { (event) =>
                this.setState({application_link : event.target.value})}/><br/>
            <Tooltip title={!this.formIsValid() ? "Please fill out required fields" : ""} placement="top">
              <span>
                <Button variant="contained" style={buttonStyle}
                  disabled={!this.formIsValid()}
                  onClick = {(event) => {
                    let programInfo = this.state;
                    if(this.props.title === "Add Program") {
                      axios.post("https://zagsabroad-backend.herokuapp.com/addprogram", programInfo).then((res) => {
                        console.log(res.data);
                        if(res.data.errno) { // Error adding the program
                          this.props.displayMessage("Error adding program");
                        } else { // No error, program added successfully
                          this.props.displayMessage("Program added successfully");
                        }
                        this.props.onClose();
                      });
                    } else if(this.props.title === "Edit Program") {
                      programInfo.org_host_program = this.props.host_program; // Store program name to programInfo object
                      //console.log(programInfo.org_host_program);
                      axios.post("http://localhost:3001/editprogram", programInfo).then((res) => {
                        console.log(res.data);
                        if(res.data.errno) { // Error updating the program
                          this.props.displayMessage("Error updating program");
                        } else { // No error, program updated successfully
                          this.props.displayMessage("Program updated successfully");
                        }
                        this.props.onClose();
                      });
                    }
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
