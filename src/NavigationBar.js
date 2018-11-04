import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './NavigationBar.css';
import { Link } from "react-router-dom";

class NavigationBar extends Component {
  render() {
    const cookies = this.props.cookies;
    const loggedIn = Boolean(cookies.get('email'));
    if(!loggedIn) {
      return (
        <div>
          <MuiThemeProvider>
            <div className="NavigationBar">
              <h2> Zags Abroad </h2>
              <Link to="/signup">
                <RaisedButton label="Sign Up"/>
              </Link>
              <Link to="/login">
                <RaisedButton label="Log in"/>
              </Link>
            </div>
          </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        <div>
          <MuiThemeProvider>
            <div className="NavigationBar">
              <h2> Zags Abroad </h2>
              <RaisedButton label = "My Account"/>
              <RaisedButton label = "Log out"
                onClick = {(event) => {
                  cookies.remove('email');
                  cookies.remove('role'); }}/>
            </div>
          </MuiThemeProvider>
        </div>
      );
    }

  }

}

export default NavigationBar;
