import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

const textFieldStyle = {
  width: 250,
  margin: '10px'
};

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      validUser : false,
      isAdmin : false,
      emailExists : false,
      showPrompt : false
    }
    this.logIn = this.logIn.bind(this); // Bind 'this' context to logIn function
  }

  logIn(event) {
    this.setState({emailExists: false, showPrompt: false}); // Reset state
    var accountInfo = {
      "email" : this.state.email,
      "password" : this.state.password
    }
    // for local testing: "http://localhost:3001/login"
    axios.post("https://zagsabroad-backend.herokuapp.com/login", accountInfo).then((res) => {
      if(res.data === "Email not found") {
        this.setState({showPrompt : true});
      } else if(res.data === "Incorrect password") {
        // Email found but password is wrong
        this.setState({emailExists : true});
      } else {
        // Valid log in. Set cookies and check if admin or not
        const cookies = this.props.cookies;
        cookies.set('email', this.state.email); // Might be good to store user ID instead
        if(res.data.is_admin === 1) {
          cookies.set('role', 'admin');
          this.setState({validUser : true, isAdmin : true});
        } else {
          cookies.set('role', 'user');
          this.setState({validUser : true});
        }
      }
    });
  }

  render() {
    return (
      <div>
        <h1> Log In </h1>
        <TextField label = "Email" style = {textFieldStyle}
          onChange = { (event) =>
            this.setState({email : event.target.value})}/>
        <br/>
        <TextField type = "password" label = "Password" style = {textFieldStyle}
          onChange = { (event) =>
            this.setState({password : event.target.value})}
          helperText = {this.state.emailExists ? "Password is incorrect" : ""}/>
        <br/> <br/>
        <Button label="Log in" variant="contained"
          disabled = {!(this.state.email && this.state.password)}
          onClick = {(event) =>
            this.logIn(event)}> Log In </Button>
        {this.state.validUser === true ?
          (this.state.isAdmin === true ? <Redirect to="/admin"/> : <Redirect to="/"/>)
          : (this.state.emailExists) ? null :
          <Dialog open={this.state.showPrompt}>
            <DialogTitle id="simple-dialog-title">Account doesn't exist. Sign up now?</DialogTitle>
            <div>
              <Button variant="contained" component={Link} to="/signup">
                Sign Up
              </Button>
              <Button variant="contained"
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

export default LogInPage;
