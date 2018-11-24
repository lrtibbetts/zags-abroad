import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';

const largeTextFieldStyle = {
  width: 300,
  margin: '10px'
};

const smallTextFieldStyle = {
  width: 150,
  margin: '10px'
}

const buttonStyle = {
  margin: '5px'
}

const dropdownStyle = {
  width: 200,
  display: 'inline-block',
  margin: '6px'
}

class CourseDetailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host_program: this.props.course[0],
      host_course_number: this.props.course[1],
      host_course_name: this.props.course[2],
      gu_course_number: this.props.course[3],
      gu_course_name: this.props.course[4],
      core: this.props.course[5],
      comments: this.props.course[6],
      signature_needed: this.props.course[7],
      approved_by: this.props.course[8],
      approval_date: this.props.course[9],
      approved_until: this.props.course[10],
      department: this.props.course[11]
    }
    this.formIsValid = this.formIsValid.bind(this);
    this.handleChangeSignatureNeeded = this.handleChangeSignatureNeeded.bind(this);
  }

  formIsValid() {
    // Check that all required fields are filled
    return (this.state.host_program && this.state.host_course_name && this.state.gu_course_number
    && this.state.gu_course_name && this.state.signature_needed && this.state.approved_by
    && this.state.approval_date && this.state.department);
  }

  handleChangeSignatureNeeded(selectedOption) {
    this.setState({signature_needed: selectedOption.value});
  }

  render() {
    // TODO: autofilled dropdown menus for program, department
    return (
      <div>
        <Dialog open={true} onClose={this.props.onClose} scroll='body'>
          <DialogTitle id="simple-dialog-title"> {this.props.title} </DialogTitle>
          <div>
            <TextField required style={largeTextFieldStyle} label = "Host program"
              defaultValue = {this.state.host_program}
              onChange = { (event) =>
                this.setState({host_program : event.target.value})}/><br/>
            <TextField style={smallTextFieldStyle} label = "Host course number"
              defaultValue = {this.state.host_course_number}
              onChange = { (event) =>
                this.setState({host_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Host course name"
              defaultValue = {this.state.host_course_name}
              onChange = { (event) =>
                this.setState({host_course_name : event.target.value})}/>
            <TextField required style={smallTextFieldStyle} label = "GU course number"
              defaultValue = {this.state.gu_course_number}
              onChange = { (event) =>
                this.setState({gu_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "GU course name"
              defaultValue = {this.state.gu_course_name}
              onChange = { (event) =>
                this.setState({gu_course_name : event.target.value})}/>
            <TextField style={largeTextFieldStyle} label = "Comments"
              defaultValue = {this.state.comments}
              onChange = { (event) =>
                this.setState({comments : event.target.value})}/>
            <div style = {dropdownStyle}>
              <DropdownTextField
                label="Signature needed"
                placeholder={this.state.signature_needed ? this.state.signature_needed : ""}
                options={[{value: "YES", label: "YES"},
                          {value: "NO", label: "NO"}]}
                onChange={this.handleChangeSignatureNeeded}/>
            </div>
            <TextField required style={largeTextFieldStyle} label = "Approved by"
              defaultValue = {this.state.approved_by}
              onChange = { (event) =>
                this.setState({approved_by : event.target.value})}/>
            <TextField required style={smallTextFieldStyle} label = "Approval date"
              type = "date"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue = {this.state.approval_date}
              onChange = { (event) =>
                this.setState({approval_date : event.target.value})}/>
            <TextField style={smallTextFieldStyle} label = "Approved until"
              type = "date"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue = {this.state.approved_until}
              onChange = { (event) =>
                this.setState({approved_until : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Department"
              defaultValue = {this.state.department}
              onChange = { (event) =>
                this.setState({department : event.target.value})}/>
            <br/>
            <Tooltip title={!this.formIsValid() ? "Please fill out required fields" : ""} placement="top">
              <span>
                <Button variant="contained" style={buttonStyle}
                  disabled={!this.formIsValid()}
                  onClick = {(event) => {
                    let courseInfo = this.state;
                    if(this.props.title === "Add Course Equivalency") {
                      axios.post("https://zagsabroad-backend.herokuapp.com/addcourse", courseInfo).then((res) => {
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

export default CourseDetailForm;
