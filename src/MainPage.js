import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class MainPage extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <h1>Zags Abroad</h1>
          <a href="signup">
            <RaisedButton label="Sign Up"/>
          </a>
          <br/> <br/>
          <a href="login">
            <RaisedButton label="Log in"/>
          </a>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainPage;
