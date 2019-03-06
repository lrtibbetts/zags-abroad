import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const textFieldStyle = {
  width: 250,
  margin: '10px'
};

const buttonStyle = {
  margin: '5px'
};

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
      showPrompt : false,
      snackbarOpen: false,
      snackMessage: '',
      buttonDisabled: false,
    }
  }

  sendEmail(event) {
    this.setState({buttonDisabled: true});
    var accountInfo = {
      "email" : this.state.email,
      "first" : this.state.firstName,
      "last" : this.state.lastName,
      "password": this.state.password
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/send", accountInfo).then((res) => {
      if(res.data.sent === true) {
        //setting label for the  snackbar
        //making sure that the email was sent
        this.setState({snackMessage: "Please check your email to continue! (Also check your junk mail!)"})
        //pass info for verification
      } else {
        //change message
        this.setState({snackMessage: "Something went wrong. Please wait a few minutes and try again!"})
      }
    })
  }

  verifyEmail(event) {
    axios.get("https://zagsabroad-backend.herokuapp.com/verify").then((res) => {
      console.log("response from frontend")
      console.log(res);
    })
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
      if(res.data !== "User already exists") {
        // Account created successfully
        this.setState({accountCreated : true});
        // const cookies = this.props.cookies;
        // cookies.set('email', this.state.email, {'maxAge': 7200, 'path': '/'}); // Might be good to store user ID instead
        // cookies.set('role', 'user', {'maxAge': 7200, 'path': '/'}); // By default, users are not given admin access
      } else {
        this.setState({showPrompt : true});
      }
    });
  }

  formIsValid() {
    // Check that no fields are empty and there are no errors (email or password)
    this.setState({buttonDisabled: (this.state.firstName && this.state.lastName && this.state.email && !this.state.emailError &&
      this.state.password && this.state.confirmedPassword && !this.state.passwordMatchingError)})
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
            if(this.formIsValid() && event.key === 'Enter') {
              this.makeAccount(event)
            }}}/>
        <br/>
        <div>
        <Button
        variant="contained"
        disabled={this.state.buttonDisabled}
        onClick= {(event) => {
          this.setState({snackbarOpen: true}, () => {
            this.sendEmail();
            this.makeAccount(event);
            console.log("account made")
          });
        }}> Get started </Button>

        </div>

        {this.state.accountCreated === true ?
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={4000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={this.state.snackMessage}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={this.props.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          /> :
          <Dialog open={this.state.showPrompt}>
            <DialogTitle id="simple-dialog-title">Account already exists. Log in instead?</DialogTitle>
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
          </Dialog>}
      </div>
    )
  }

}

export default SignUpPage;
