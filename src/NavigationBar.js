import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import './NavigationBar.css';
import { Link } from "react-router-dom";

const buttonStyle = {
  margin: '100px'
}

class NavigationBar extends Component {
  render() {
    const cookies = this.props.cookies;
    const loggedIn = Boolean(cookies.get('email'));
    if(!loggedIn) {
      return (
        <div className="NavigationBar">
          <h2> Zags Abroad </h2>
          <Button style={buttonStyle} variant="contained" component={Link} to="/signup">
            Sign Up
          </Button>
          <Button style={buttonStyle} variant="contained" component={Link} to="/login">
            Log In
          </Button>
        </div>
      );
    } else {
      return (
        <div className="NavigationBar">
          <h2> Zags Abroad </h2>
          <Button variant="contained"> My Account </Button>
          <Button variant="contained"
            onClick = {(event) => {
              cookies.remove('email');
              cookies.remove('role'); }}>
              Log Out </Button>
        </div>
      );
    }

  }

}

export default NavigationBar;
