import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: ''
    }
  }

  logIn(event) {
    // TODO: get request to backend API
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
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
        </MuiThemeProvider>
      </div>
    )
  }

}

export default LogInPage
