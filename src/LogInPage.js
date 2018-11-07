import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

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
        <MuiThemeProvider>
          <div>
            <h1> Log In </h1>
            <TextField
              floatingLabelText = "Email"
              onChange = { (event, newValue) =>
                this.setState({email : newValue})}/>
            <br/>
            <TextField
              type = "password"
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})}
              errorText = {this.state.emailExists ? "Password is incorrect" : ""}/>
            <br/>
            <RaisedButton label="Log in"
              disabled = {!(this.state.email && this.state.password)}
              onClick = {(event) =>
                this.logIn(event)}/>
            {this.state.validUser === true ?
              (this.state.isAdmin === true ? <Redirect to="/admin"/> : <Redirect to="/"/>)
              : (this.state.emailExists) ? null :
              <Dialog open={this.state.showPrompt}>
                <DialogTitle id="simple-dialog-title">Account doesn't exist. Sign up now?</DialogTitle>
                <div>
                  <Link to="/signup">
                    <RaisedButton label="Sign Up"/>
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

export default LogInPage;
