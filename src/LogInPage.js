import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { InputAdornment, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({});

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: '',
      validUser: false,
      isAdmin : false
    }
    this.logIn = this.logIn.bind(this); // Bind 'this' context to logIn function
  }

  logIn(event) {
    var accountInfo = {
      "email" : this.state.email,
      "password" : this.state.password
    }
    // for local testing: "http://localhost:3001/login"
    axios.post("http://zagsabroad-backend.herokuapp.com/login", accountInfo).then((res) => {
      console.log(res.data);
      if(res.data !== "No such user exists") {
        // User exists in database
        if(res.data[0].is_admin === 1) {
          this.setState({validUser : true, isAdmin : true});
        } else {
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
              type ="password"
              {...this.props}
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})}/>
            <br/>
            <RaisedButton label="Log in"
              disabled = {!(this.state.email && this.state.password)}
              onClick = {(event) =>
                this.logIn(event)}/>
            {this.state.validUser === true ?
              (this.state.isAdmin === true ? <Redirect to="/admin"/> : <Redirect to="/"/>)
              : null} {/* TODO: pop-up prompting user to make an accunt */}
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default LogInPage
