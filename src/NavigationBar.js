import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class NavigationBar extends Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    if(!isLoggedIn) {
      return (
        <div>
          <MuiThemeProvider>
            <div>
              <a href="signup">
                <RaisedButton label="Sign Up"/>
              </a>
              <br/> <br/>
              <a href="login">
                <RaisedButton label="Log in"/>
              </a>
            </div>
          </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        // TODO: display Log out and My account buttons
        <div>
          <h1> "Logged in" </h1>
        </div>
      );
    }

  }

}

export default NavigationBar;
