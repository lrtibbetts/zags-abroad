import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const largeTextFieldStyle = {
  width: 300,
  margin: '10px'
};

const smallTextFieldStyle = {
  width: 150,
  margin: '10px'
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
      comments: this.props.course[5],
      signature_needed: this.props.course[6],
      approved_by: this.props.course[7],
      approval_date: this.props.course[8],
      approved_until: this.props.course[9],
      department: this.props.course[10]
    }
  }

  render() {
    // TODO: confirmation message when course is added or updated successfully
    // TODO: autofilled dropdown menus for program, department, signature (YES/NO)
    // tODO: autofill formatting for date fields
    // TODO: disable save button until required fields are filled
    return (
      <div>
        <MuiThemeProvider>
          <Dialog open={true} onClose={this.props.onClose} scroll='body'>
            <DialogTitle  id="simple-dialog-title"> {this.props.title} </DialogTitle>
            <div>
              <TextField style={largeTextFieldStyle} label = "Host program"
                defaultValue = {this.state.host_program}
                onChange = { (event) =>
                  this.setState({host_program : event.target.value})}/><br/>
              <TextField style={smallTextFieldStyle} label = "Host course number"
                defaultValue = {this.state.host_course_number}
                onChange = { (event) =>
                  this.setState({host_course_number : event.target.value})}/>
              <TextField style={largeTextFieldStyle} label = "Host course name"
                defaultValue = {this.state.host_course_name}
                onChange = { (event) =>
                  this.setState({host_course_name : event.target.value})}/>
              <TextField style={smallTextFieldStyle} label = "GU course number"
                defaultValue = {this.state.gu_course_number}
                onChange = { (event) =>
                  this.setState({gu_course_number : event.target.value})}/>
              <TextField style={largeTextFieldStyle} label = "GU course name"
                defaultValue = {this.state.gu_course_name}
                onChange = { (event) =>
                  this.setState({gu_course_name : event.target.value})}/>
              <TextField style={largeTextFieldStyle} label = "Comments"
                defaultValue = {this.state.comments}
                onChange = { (event) =>
                  this.setState({comments : event.target.value})}/>
              <TextField style={smallTextFieldStyle} label = "Signature needed"
                defaultValue = {this.state.signature_needed}
                onChange = { (event) =>
                  this.setState({signature_needed : event.target.value})}/>
              <TextField style={largeTextFieldStyle} label = "Approved by"
                defaultValue = {this.state.approved_by}
                onChange = { (event) =>
                  this.setState({approved_by : event.target.value})}/>
              <TextField style={smallTextFieldStyle} label = "Approval date"
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
              <TextField style={largeTextFieldStyle} label = "Department"
                defaultValue = {this.state.department}
                onChange = { (event) =>
                  this.setState({department : event.target.value})}/>
              <br/>
              <Button variant="contained"
                onClick = {(event) => {
                  let courseInfo = this.state;
                  if(this.props.title === "Add Course Equivalency") {
                    axios.post("https://zagsabroad-backend.herokuapp.com/addcourse", courseInfo).then((res) => {
                        console.log(res.data);
                        this.props.onClose();
                    });
                  } else if(this.props.title === "Edit Course Equivalency") {
                    courseInfo.id = this.props.courseId; // Add course id to courseInfo object
                    axios.post("https://zagsabroad-backend.herokuapp.com/editcourse", courseInfo).then((res) => {
                        console.log(res.data);
                        this.props.onClose();
                    });
                  }
                }}>
                Save
              </Button>
              <Button variant="contained"
                onClick = {this.props.onClose}>
                Cancel
              </Button>
            </div>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default CourseDetailForm;
