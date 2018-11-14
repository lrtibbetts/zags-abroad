import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from 'material-ui/TextField';
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
            <TextField style={largeTextFieldStyle} floatingLabelText = "Host program"
              defaultValue = {this.state.host_program}
              onChange = { (event, newValue) =>
                this.setState({host_program : newValue})}/><br/>
            <TextField style={smallTextFieldStyle} floatingLabelText = "Host course number"
              defaultValue = {this.state.host_course_number}
              onChange = { (event, newValue) =>
                this.setState({host_course_number : newValue})}/>
            <TextField style={largeTextFieldStyle} floatingLabelText = "Host course name"
              defaultValue = {this.state.host_course_name}
              onChange = { (event, newValue) =>
                this.setState({host_course_name : newValue})}/>
            <TextField style={smallTextFieldStyle} floatingLabelText = "GU course number"
              defaultValue = {this.state.gu_course_number}
              onChange = { (event, newValue) =>
                this.setState({gu_course_number : newValue})}/>
            <TextField style={largeTextFieldStyle} floatingLabelText = "GU course name"
              defaultValue = {this.state.gu_course_name}
              onChange = { (event, newValue) =>
                this.setState({gu_course_name : newValue})}/>
            <TextField style={largeTextFieldStyle} floatingLabelText = "Comments"
              defaultValue = {this.state.comments}
              onChange = { (event, newValue) =>
                this.setState({comments : newValue})}/>
            <TextField style={smallTextFieldStyle} floatingLabelText = "Signature needed"
              defaultValue = {this.state.signature_needed}
              onChange = { (event, newValue) =>
                this.setState({signature_needed : newValue})}/>
            <TextField style={largeTextFieldStyle} floatingLabelText = "Approved by"
              defaultValue = {this.state.approved_by}
              onChange = { (event, newValue) =>
                this.setState({approved_by : newValue})}/>
            <TextField style={smallTextFieldStyle} floatingLabelText = "Approval date"
              defaultValue = {this.state.approval_date}
              onChange = { (event, newValue) =>
                this.setState({approval_date : newValue})}/>
            <TextField style={smallTextFieldStyle} floatingLabelText = "Approved until"
              defaultValue = {this.state.approved_until}
              onChange = { (event, newValue) =>
                this.setState({approved_until : newValue})}/>
            <TextField style={largeTextFieldStyle} floatingLabelText = "Department"
              defaultValue = {this.state.department}
              onChange = { (event, newValue) =>
                this.setState({department : newValue})}/>
            <br/>
            <RaisedButton label="Save"
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
              }}/>
            <RaisedButton label="Cancel"
              onClick = {this.props.onClose}/>
            </div>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default CourseDetailForm;
