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

const buttonStyle = {
  margin: '5px'
};

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      validUser : false,
      isAdmin : false,
      wrongPassword : false,
      noAccount : false,
      notVerified: false,
    }
  }

  logIn(event) {
    this.setState({wrongPassword: false, noAccount: false, notVerified: false}); // Reset state
    var accountInfo = {
      "email" : this.state.email,
      "password" : this.state.password
    }
    // for local testing: "http://localhost:3001/login"
    axios.post("https://zagsabroad-backend.herokuapp.com/login", accountInfo).then((res) => {
      if(res.data === "Not verified") {
        this.setState({notVerified: true});
      } else if(res.data === "Email not found") {
        this.setState({noAccount : true});
      } else if(res.data === "Incorrect password") {
        // Email found but password is wrong
        this.setState({wrongPassword : true});
      } else {
        // Valid log in. Set cookies and check if admin or not
        const cookies = this.props.cookies;
        cookies.set('email', this.state.email, {'maxAge': 7200, 'path': '/'}); // Might be good to store user ID instead
        if(res.data[0].is_admin === 1) {
          cookies.set('role', 'admin', {'maxAge': 7200, 'path': '/'}); // Cookies will expire after two hours
          this.setState({isAdmin : true});
        } else {
          cookies.set('role', 'user', {'maxAge': 7200, 'path': '/'});
          this.setState({validUser : true});
        }
      }
    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1> Log In </h1>
        <TextField id="email" label="Email" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({email : event.target.value})}/>
        <br/>
        <TextField id="password" type="password" label="Password" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({password : event.target.value})}
          helperText = {this.state.wrongPassword ? "Password is incorrect" : ""}
          onKeyPress = {(event) => {
            if(this.state.email && this.state.password && event.key === 'Enter') {
              this.logIn(event)
            }}}/>
        <br/> <br/>
        <Button label="Log in" variant="contained"
          disabled = {!(this.state.email && this.state.password)}
          onClick = {(event) =>
            this.logIn(event)}> Log In </Button>
        {this.state.isAdmin === true ? <Redirect to="/admin"/> : null}
        {this.state.validUser === true ? <Redirect to="/"/> : null}
        <Dialog open={this.state.notVerified}>
          <DialogTitle>Please check your email to verify your account before logging in!</DialogTitle>
            <div>
              <Button style={buttonStyle}
                variant= 'contained'
                onClick = {(event) => {
                  this.setState({notVerified: false})}}>
                Okay
              </Button>
            </div>
        </Dialog>
        <Dialog open={this.state.noAccount}>
          <DialogTitle> Account doesn't exist. Sign up now? </DialogTitle>
          <div>
            <Button style={buttonStyle} variant="contained" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button style={buttonStyle} variant="contained"
              onClick = {(event) =>
                this.setState({noAccount : false})}>
              Try again
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default LogInPage;
