import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
      confirmedPassword : '',
      passwordMatchingError : false,
      passwordLengthError : false,
      emailError : false
    }
  }

  makeAccount(event) {
    // TODO: post request to backend API

  }

  formIsValid() {
    // Check that no fields are empty and there are no errors (email or password)
    return (this.state.firstName && this.state.lastName && this.state.email && !this.state.emailError &&
      this.state.password && this.state.confirmedPassword && !this.state.passwordMatchingError)
  }

  passwordsMatch() {
    return (this.state.password === this.state.confirmedPassword)
  }

  render() {return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1> Sign Up </h1>
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
              onChange = { (event, newValue) => {
                this.setState({password : newValue, passwordMatchingError : ((this.state.confirmedPassword &&
                newValue !== this.state.confirmedPassword) ? true : false)})
                this.setState({passwordLengthError : (newValue.length >= 8) ? false : true})}}
              errorText = {this.state.passwordLengthError ? "Please enter at least 8 characters" : ""}/>
            <br/>
            <TextField
              floatingLabelText = "Confirm Password"
              onChange = { (event, newValue) =>
                this.setState({confirmedPassword : newValue, passwordMatchingError:
                ((this.state.password !== newValue) ? true : false)})}
              errorText = {this.state.passwordMatchingError ? "Please enter a matching password" : ""}/>
            <br/>
            <RaisedButton label="Get started"
              disabled = {!this.formIsValid()}
              onClick = {(event) =>
                this.makeAccount(event)}/>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default SignUpPage
