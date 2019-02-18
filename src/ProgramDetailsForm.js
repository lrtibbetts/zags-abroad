import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';
import MultiDropdownTextField from './MultiDropdownTextField.js';


//dropdown text field for Program Type isn't appearing

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

// Make department field required
class ProgramDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //in state will be there this.props.program[1] or [2] etc will
      //give us host_program, host_url, and such things
      programs: [],
      host_program: [
        //stuff about program goes here
    ],
      host_url: [],
      city: [],
      application_link: [],
      program_type: [],
      program_types: ["semester", "faculty", "idk"]
    }

    this.handleChangeSignatureNeeded = this.handleChangeSignatureNeeded.bind(this);
  }


  formIsValid() {
    // Check that all required fields are filled
    return (this.state.host_program && this.state.host_url && this.state.city &&
    this.state.application_link && this.state.program_type);
  }

  handleChangeSignatureNeeded(selectedOption) {
    this.setState({signature_needed: selectedOption.value});
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
          <div>
            <TextField style={smallTextFieldStyle} label = "Host Program Name"
              defaultValue = {this.state.host_program}
              onChange = { (event) =>
                this.setState({host_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Host Program URL"
              defaultValue = {this.state.host_url}
              onChange = { (event) =>
                this.setState({host_course_name : event.target.value})}/>
            <TextField required style={smallTextFieldStyle} label = "Location"
              defaultValue = {this.state.city}
              onChange = { (event) =>
                this.setState({gu_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Application link"
              defaultValue = {this.state.application_link}
              onChange = { (event) =>
                this.setState({gu_course_name : event.target.value})}/>
            <div style = {smallDropdownStyle}>
              <DropdownTextField
                required={true}
                label="Program Type"
                options={[{value: "faculty", label: "faculty"},
                          {value: "idk", label: "idk"}]}
                onChange={this.handleChangeSignatureNeeded}/>
                </div>
            <Tooltip title={!this.formIsValid() ? "Please fill out required fields" : ""} placement="top">
              <span>
                <Button variant="contained" style={buttonStyle}
                  disabled={!this.formIsValid()}
                  onClick = {(event) => {
                    let courseInfo = this.state;
                    courseInfo.core = courseInfo.core.map(item => item.value).join(', ') + ",";
                    if(this.props.title === "Add Course Equivalency") {
                      axios.post("https://zagsabroad-backend.herokuapp.com/addcourse", courseInfo).then((res) => {
                        console.log(res.data);
                        if(res.data.errno) { // Error adding the course
                          this.props.displayMessage("Error adding course");
                        } else { // No error, course added successfully
                          this.props.displayMessage("Course added successfully");
                        }
                        this.props.onClose();
                      });
                    } else if(this.props.title === "Edit Course Equivalency") {
                      courseInfo.id = this.props.courseId; // Add course id to courseInfo object
                      axios.post("https://zagsabroad-backend.herokuapp.com/editcourse", courseInfo).then((res) => {
                        console.log(res.data);
                        if(res.data.errno) { // Error updating the course
                          this.props.displayMessage("Error updating course");
                        } else { // No error, course updated successfully
                          this.props.displayMessage("Course updated successfully");
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
