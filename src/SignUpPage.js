import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

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
      emailError : false,
      accountCreated : false,
      showPrompt : false
    }
    this.makeAccount = this.makeAccount.bind(this); // Bind 'this' context to makeAccount function
  }

  makeAccount(event) {
    var accountInfo = {
      "email" : this.state.email,
      "first" : this.state.firstName,
      "last" : this.state.lastName,
      "password" : this.state.password
    }

    // local testing: "http://localhost:3001/signup"
    // Using an arrow function allows us to access 'this' within the API callback
    axios.post("http://zagsabroad-backend.herokuapp.com/signup", accountInfo).then((res) => {
      console.log(res.data);
      if(res.data !== "User already exists") {
        // Account created successfully
        this.setState({accountCreated : true});
      } else {
        this.setState({showPrompt : true});
      }
    });
  }

  formIsValid() {
    // Check that no fields are empty and there are no errors (email or password)
    return (this.state.firstName && this.state.lastName && this.state.email && !this.state.emailError &&
      this.state.password && this.state.confirmedPassword && !this.state.passwordMatchingError)
  }

  render() {
    return (
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
                this.setState((!newValue.match(/^[A-Za-z0-9]+@zagmail.gonzaga.edu/)
                && !newValue.match(/^[A-Za-z0-9]+@gonzaga.edu/)) ?
                {emailError : true} : {emailError : false, email : newValue})}
              errorText = {this.state.emailError ? "Please enter a Zagmail address" : ""}/>
            <br/>
            <TextField
              type ="password"
              {...this.props}
              floatingLabelText = "Password"
              onChange = { (event, newValue) => {
                this.setState({password : newValue, passwordMatchingError : ((this.state.confirmedPassword &&
                newValue !== this.state.confirmedPassword) ? true : false)})
                this.setState({passwordLengthError : (newValue.length >= 8) ? false : true})}}
              errorText = {this.state.passwordLengthError ? "Please enter at least 8 characters" : ""}/>
            <br/>
            <TextField
              type ="password"
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
            {/* Redirect to home page if account is created successfully. TODO: pop-up if user already exists */}
            {this.state.accountCreated === true ?
              <Redirect to="/"/> :
              <Dialog open={this.state.showPrompt}>
                <DialogTitle id="simple-dialog-title">Account already exists. Log in instead?</DialogTitle>
                <div>
                  <Link to="/login">
                    <RaisedButton label="Log in"/>
                  </Link>
                  <RaisedButton label="Try again"
                    onClick = {(event) =>
                      this.setState({showPrompt : false})}/>
                </div>
              </Dialog>}
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default SignUpPage;
