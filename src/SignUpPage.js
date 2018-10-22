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
      passwordError : false,
      emailError : false
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title = "Sign Up" />
            <TextField
              floatingLabelText = "First Name"
              onChange = { (event, newValue) =>
                this.setState({firstName : newValue})
              }
            />
            <br/>
            <TextField
              floatingLabelText = "Last Name"
              onChange = { (event, newValue) =>
                this.setState({lastName : newValue})
              }
            />
            <br/>
            <TextField
              floatingLabelText = "Email"
              onChange = { (event, newValue) =>
                this.checkEmail(newValue)
              }
              errorText = {this.state.emailError ? "Enter a zagmail address" : ""}
            />
            <br/>
            <TextField
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})
              }
            />
            <br/>
            <TextField
              floatingLabelText = "Confirm Password"
              onChange = { (event, newValue) =>
                // Check that newValue matches the existing password
                this.checkPassword(newValue)
              }
              errorText = {this.state.passwordError ? "Enter a matching password" : ""}
            />
            <br/>
            <RaisedButton label="Get started"
              disabled = {!this.checkForm()}
              onClick = {(event) =>
                this.makeAccount(event)
              }
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

  checkEmail(newValue) {
    if(!newValue.match(/^[A-Za-z0-9]+@zagmail.gonzaga.edu/)) {
      this.setState({emailError : true})
    } else {
      this.setState({emailError : false})
      this.setState({email : newValue})
    }
  }

  checkPassword(newValue) {
    if(this.state.password !== newValue) {
      this.setState({passwordError : true})
    } else {
      this.setState({passwordError : false})
    }
  }

  checkForm() {
    // Check that no fields are empty and there are no errors (email or password)
    return (this.firstName && this.lastName && this.email && !this.emailError && this.password && !this.passwordError)
  }

  makeAccount(event) {
  }

}

export default SignUpPage
