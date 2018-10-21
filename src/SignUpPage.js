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
      password : ''
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
                this.setState({email : newValue})
              }
            />
            <br/>
            <TextField
              floatingLabelText = "Password"
              onChange = { (event, newValue) =>
                this.setState({password : newValue})
              }
            />
            <br/>
            <RaisedButton label="Get started"
              onClick = {(event) =>
                this.makeAccount(event)
              }
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

  makeAccount(event) {

  }

}

export default SignUpPage
