import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from 'material-ui/TextField';

class CourseDetailForm extends Component {

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Dialog open={true} onClose={this.props.onClose} scroll='body'>
            <DialogTitle  id="simple-dialog-title"> {this.props.title} </DialogTitle>
            <div>
            <TextField floatingLabelText = "Host program"/>
            <TextField floatingLabelText = "Host course number"/>
            <TextField floatingLabelText = "Host course name"/>
            <TextField floatingLabelText = "GU course number"/>
            <TextField floatingLabelText = "GU course name"/>
            <TextField floatingLabelText = "Comments"/>
            <TextField floatingLabelText = "Signature needed"/>
            <TextField floatingLabelText = "Approved by"/>
            <TextField floatingLabelText = "Approval date"/>
            <TextField floatingLabelText = "Approved until"/>
            <TextField floatingLabelText = "Department"/> <br/>
            <RaisedButton label="Save"
              onClick = {(event) => {
                // TODO: call backend API to update or save based on type of form
                this.props.onClose();
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
