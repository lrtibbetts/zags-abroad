import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from "react-router-dom";

const textFieldStyle = {
  width: 250,
  margin: '10px'
};

const buttonStyle = {
  margin: '5px'
};

class PasswordResetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmedPassword: '',
      token: this.props.token,
      sending: false,
      passwordReset: false // Set to true after successful reset
    }
  }

  resetPassword() {
    this.setState({sending: true})
    let params = {
      token: this.state.token,
      password: this.state.newPassword
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/reset", params).then((res) => {
      this.setState({passwordReset: true, sending: false})
    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h3> Please enter a new password </h3>
        <TextField label="Password" style={textFieldStyle} type="password"
          helperText = {this.state.newPassword.length > 0 && this.state.newPassword.length < 8
          ? "Please enter at least 8 characters" : ""}
          onChange = { (event) =>
            this.setState({newPassword : event.target.value})}/>
        <br/>
        <TextField label="Confirm your password" style={textFieldStyle} type="password"
          helperText = {this.state.newPassword !== this.state.confirmedPassword
          && this.state.confirmedPassword.length > 0 ? "Please enter a matching password" : ""}
          onChange = { (event) =>
            this.setState({confirmedPassword : event.target.value})}/>
        <br/><br/>
        {this.state.sending ? <CircularProgress variant="indeterminate"/> :
        <Button variant="contained"
          disabled = {this.state.newPassword.length === 0 ||
          this.state.newPassword !== this.state.confirmedPassword}
          onClick = {(event) =>
            this.resetPassword()}> Reset password </Button>} <br/>
        <Dialog open={this.state.passwordReset}>
          <DialogTitle> Your password has been reset! </DialogTitle>
          <div>
            <Button style={buttonStyle} variant="contained" component={Link} to="/login">
              Log in
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default PasswordResetPage;
