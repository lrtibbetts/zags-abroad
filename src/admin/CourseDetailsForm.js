import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import DropdownTextField from '../DropdownTextField.js';
import MultiDropdownTextField from '../MultiDropdownTextField.js';

const largeTextFieldStyle = {
  width: 300,
  margin: '10px'
};

const mediumTextFieldStyle = {
  width: 250,
  margin: '10px'
};

const smallTextFieldStyle = {
  width: 170,
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
class CourseDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      programs: [],
      coreDesignations: [],
      host_program: this.props.course[0],
      host_course_number: this.props.course[1],
      host_course_name: this.props.course[2],
      gu_course_number: this.props.course[3],
      gu_course_name: this.props.course[4],
      core: this.props.course[5] ? this.formatCore(this.props.course[5]) : [],
      comments: this.props.course[6],
      signature_needed: this.props.course[7],
      approved_by: this.props.course[8],
      approval_date: this.props.course[9],
      approved_until: this.props.course[10],
      department: this.props.course[11]
    }

    this.handleChangeSignatureNeeded = this.handleChangeSignatureNeeded.bind(this);
    this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
    this.handleChangeProgram = this.handleChangeProgram.bind(this);

    // Get list of department codes for dropdown menu
    axios.get("https://zagsabroad-backend.herokuapp.com/departments").then((res) => {
      let departmentsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let deptCode = res.data[i].dept_code;
        let deptObj = {value: deptCode, label: deptCode};
        departmentsToAdd.push(deptObj);
      }
      this.setState({departments: departmentsToAdd});
    });

    // Get list of programs for dropdown menu
    axios.get("https://zagsabroad-backend.herokuapp.com/programs").then((res) => {
      let programsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let program = res.data[i].host_program;
        let programObj = {value: program, label: program};
        programsToAdd.push(programObj);
      }
      this.setState({programs: programsToAdd});
    });

    // Get list of core designations for dropdown menu
    axios.get("https://zagsabroad-backend.herokuapp.com/core").then((res) => {
      let coreDesignationsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let core = res.data[i].core_name;
        let coreObj = {value: core, label: core};
        coreDesignationsToAdd.push(coreObj);
      }
      this.setState({coreDesignations: coreDesignationsToAdd});
    });
  }

  formatCore(coreStr) {
    let coreList = coreStr.split(',');
    for(let i = 0; i < coreList.length; i++) {
      let core = coreList[i].trim();
      coreList[i] = {value: core, label: core};
    }
    coreList.pop(); // Remove empty string from end of array
    return coreList;
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

  handleChangeDepartment(selectedOption) {
    this.setState({department: selectedOption.value});
  }

  handleChangeProgram(selectedOption) {
    this.setState({host_program: selectedOption.value});
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
            <div style = {largeDropDownStyle}>
              <DropdownTextField
                required={true}
                label="Program"
                placeholder={this.state.host_program ? this.state.host_program : ""}
                options={this.state.programs}
                onChange={this.handleChangeProgram}/>
            </div>
            <div style = {smallDropdownStyle}>
              <DropdownTextField
                required={true}
                label="Department"
                placeholder={this.state.department ? this.state.department : ""}
                options={this.state.departments}
                onChange={this.handleChangeDepartment}/>
            </div>
            <TextField style={smallTextFieldStyle} label = "Host Course Number"
              defaultValue = {this.state.host_course_number}
              onChange = { (event) =>
                this.setState({host_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Host Course Name"
              defaultValue = {this.state.host_course_name}
              onChange = { (event) =>
                this.setState({host_course_name : event.target.value})}/>
            <TextField required style={smallTextFieldStyle} label = "GU Course Number"
              defaultValue = {this.state.gu_course_number}
              onChange = { (event) =>
                this.setState({gu_course_number : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "GU Course Name"
              defaultValue = {this.state.gu_course_name}
              onChange = { (event) =>
                this.setState({gu_course_name : event.target.value})}/>
            <div style = {largeDropDownStyle}>
              <MultiDropdownTextField
                label="Core Designation"
                options={this.state.coreDesignations}
                value={this.state.core}
                onChange={this.handleChange("core")}/>
            </div>
            <div style = {smallDropdownStyle}>
              <DropdownTextField
                required={true}
                label="Signature Needed"
                placeholder={this.state.signature_needed ? this.state.signature_needed : ""}
                options={[{value: "YES", label: "YES"},
                          {value: "NO", label: "NO"}]}
                onChange={this.handleChangeSignatureNeeded}/>
            </div>
            <TextField style={mediumTextFieldStyle} label = "Comments"
              defaultValue = {this.state.comments}
              onChange = { (event) =>
                this.setState({comments : event.target.value})}/>
            <TextField required style={largeTextFieldStyle} label = "Approved By"
              defaultValue = {this.state.approved_by}
              onChange = { (event) =>
                this.setState({approved_by : event.target.value})}/>
            <TextField required style={smallTextFieldStyle} label = "Approval Date"
              type = "date"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue = {this.state.approval_date}
              onChange = { (event) =>
                this.setState({approval_date : event.target.value})}/>
            <TextField style={smallTextFieldStyle} label = "Approved Until"
              type = "date"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue = {this.state.approved_until}
              onChange = { (event) =>
                this.setState({approved_until : event.target.value})}/>
            <br/>
            <Tooltip title={!this.formIsValid() ? "Please fill out required fields" : ""} placement="top">
              <span style={{margin: '0 auto', marginBottom: '5px'}}>
                <Button variant="contained" style={buttonStyle}
                  disabled={!this.formIsValid()}
                  onClick = {(event) => {
                    let courseInfo = this.state;
                    courseInfo.core = courseInfo.core.map(item => item.value).join(', ') + ",";
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

export default CourseDetailsForm;
