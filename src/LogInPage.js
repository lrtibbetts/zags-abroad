import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: ''
    }
  }

  // TODO: return success or not. If success, return is_admin
  logIn(event) {
    var accountInfo = {
      "email" : this.state.email,
      "password" : this.state.password
    }
    // for local testing: "http://localhost:3001/login"
    axios.post("http://zagsabroad-backend.herokuapp.com/login", accountInfo).then(function (res) {
      console.log(res.data);
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
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})}/>
            <br/>
            <RaisedButton label="Log in"
              disabled = {!(this.state.email && this.state.password)}
              onClick = {(event) =>
                this.logIn(event)}/>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default LogInPage
