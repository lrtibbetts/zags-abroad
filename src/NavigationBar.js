import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
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
              <Button variant="contained" component={Link} to="/signup">
                Sign Up
              </Button>
              <Button variant="contained" component={Link} to="/login">
                Log In
              </Button>
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
              <Button variant="contained"> My Account </Button>
              <Button variant="contained"
                onClick = {(event) => {
                  cookies.remove('email');
                  cookies.remove('role'); }}>
                  Log Out </Button>
            </div>
          </MuiThemeProvider>
        </div>
      );
    }

  }

}

export default NavigationBar;
