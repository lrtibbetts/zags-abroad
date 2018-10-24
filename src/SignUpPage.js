import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class SignUpPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName : '',
      lastName : '',
      email : '',
      password : '',
      confirmedPassword: '',
      passwordError : false,
      emailError : false
    }
  }

  makeAccount(event) {
    // TODO: post request to backend API

  }

  render() {
    const {firstName, lastName, email, password, confirmedPassword, passwordError, emailError} = this.state
    const formIsValid = firstName && lastName && email && !emailError && password && confirmedPassword && !passwordError
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title = "Sign Up" />
            <TextField
              floatingLabelText = "First Name"
              onChange = { (event, newValue) =>
                this.setState({firstName : newValue})}/>
            <br/>
            <TextField
              floatingLabelText = "Last Name"
              onChange = { (event, newValue) =>
                this.setState({lastName : newValue})}/>
            <br/>
            <TextField
              floatingLabelText = "Email"
              onChange = { (event, newValue) =>
                this.setState((!newValue.match(/^[A-Za-z0-9]+@zagmail.gonzaga.edu/)) ? {emailError : true}
                : {emailError : false, email : newValue})}
              errorText = {this.state.emailError ? "Please enter a Zagmail address" : ""}/>
            <br/>
            <TextField
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})}/>
            <br/>
            <TextField
              floatingLabelText = "Confirm Password"
              onChange = { (event, newValue) =>
                this.setState((this.state.password !== newValue) ? {passwordError : true}
                : {passwordError: false, confirmedPassword : newValue})}
              errorText = {this.state.passwordError ? "Please enter a matching password" : ""}/>
            <br/>
            <RaisedButton label="Get started"
              disabled = {!formIsValid}
              onClick = {(event) =>
                this.makeAccount(event)}/>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
  
}

export default SignUpPage
