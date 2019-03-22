import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Link } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const textFieldStyle = {
  width: 250,
  margin: '10px'
};

const buttonStyle = { margin: '5px' };

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
      showPrompt : false,
      snackbarOpen: false,
      snackbarMessage: '',
      buttonDisabled: true,
    }
    this.formIsValid = this.formIsValid.bind(this);
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
    axios.post("https://zagsabroad-backend.herokuapp.com/signup", accountInfo).then((res) => {
      console.log(res.data);
      if (res.data.code === "ER_DUP_ENTRY") {
        // Account already exists
        this.setState({showPrompt : true});
      } else if (res.data.sent === true) {
        this.setState({snackbarOpen: true, snackbarMessage: "Please check your email to continue! (Also check your junk mail!)",
        emailSent: true}, () => { this.forceUpdate() });
      } else {
        this.setState({snackbarOpen: true, snackbarMessage: "Something went wrong"})
      }
    });
  }

  formIsValid() {
    // Check that no fields are empty and there are no errors (email or password)
    return (this.state.firstName && this.state.lastName && this.state.email && !this.state.emailError &&
      this.state.password && this.state.confirmedPassword && !this.state.passwordMatchingError);
  }

  handleClose = () => {
    this.setState({snackbarOpen: false});
  };

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1> Sign Up </h1>
        <TextField style = {textFieldStyle}
          id = "firstName"
          label = "First Name"
          onChange = { (event) =>
            this.setState({firstName : event.target.value})}/>
        <br/>
        <TextField style = {textFieldStyle}
          id = "lastName"
          label = "Last Name"
          onChange = { (event) =>
            this.setState({lastName : event.target.value})}/>
        <br/>
        <TextField style = {textFieldStyle}
          id = "email"
          label = "Email"
          onChange = { (event) => {
            let newValue = event.target.value;
            this.setState((!newValue.match(/^[A-Za-z0-9]+@zagmail.gonzaga.edu/)
            && !newValue.match(/^[A-Za-z0-9]+@gonzaga.edu/)) ?
            {emailError : true} : {emailError : false, email : newValue});
          }}
          helperText = {this.state.emailError ? "Please enter a Gonzaga email" : ""}/>
        <br/>
        <TextField style = {textFieldStyle}
          id = "password"
          type = "password"
          label = "Password"
          onChange = { (event) => {
            let newValue = event.target.value;
            this.setState({password : newValue, passwordMatchingError : ((this.state.confirmedPassword &&
            newValue !== this.state.confirmedPassword) ? true : false)});
            this.setState({passwordLengthError : (newValue.length >= 8) ? false : true});
          }}
          helperText = {this.state.passwordLengthError ? "Please enter at least 8 characters" : ""}/>
        <br/>
        <TextField style = {textFieldStyle}
          id = "confirmedPassword"
          type = "password"
          label = "Confirm Password"
          onChange = { (event) => {
            let newValue = event.target.value;
            this.setState({confirmedPassword : newValue, passwordMatchingError:
            ((this.state.password !== newValue) ? true : false)});
          }}
          helperText = {this.state.passwordMatchingError ? "Please enter a matching password" : ""}
          onKeyPress = {(event) => {
            if(Boolean(this.formIsValid()) && event.key === 'Enter') {
              this.makeAccount(event);
            }}}/>
        <br/>
        <div>
          <Button
          disabled={!Boolean(this.formIsValid())}
          variant="contained"
          onClick= {(event) => {
            this.makeAccount(event);
          }}> Get started </Button>
        </div>
        <Snackbar
          key={"email"}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={5000}
          onClose={this.handleClose}
          message={this.state.snackbarMessage}
          action={[
            <IconButton key="close" onClick={this.handleClose}>
              <CloseIcon/>
            </IconButton>]}/>
        <Dialog open={this.state.showPrompt}>
          <DialogTitle>Account already exists. Log in instead?</DialogTitle>
          <div>
            <Button style={buttonStyle} variant="contained" component={Link} to="/login">
              Log In
            </Button>
            <Button style={buttonStyle} variant="contained"
              onClick = {(event) =>
                this.setState({showPrompt : false})}>
              Try again
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default SignUpPage;
