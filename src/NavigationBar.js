import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import "./NavigationBar.css";

const buttonStyle = {
  margin: '5px',
}

const loginStyle = {
  marginTop: '20px',
  marginRight: '2vw'
}

const signupStyle = {
  marginTop: '20px',
  marginRight: '2vw',
  float: 'right'
}

const linkStyle = {
  color: 'black'
}

const headerStyle = {
  color: 'black',
  textDecoration: 'none',
  display: 'inline-block',
  marginLeft: '2vw'
}

class NavigationBar extends Component {
  render() {
    const cookies = this.props.cookies;
    const loggedIn = cookies.get('email');
    const isAdmin = cookies.get('role') === 'admin';
    if(!loggedIn) {
      return (
        <div>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          <div className="link">
            <p style={{display: 'inline', marginLeft: '2vw'}}> Already studied abroad? </p>
            <Link to="/review" style={linkStyle}>Share here.</Link>
          </div>
          <div className ="button-wrapper">
            <Button style={signupStyle} variant="outlined" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button style={loginStyle} variant="outlined" component={Link} to="/login">
              Log In
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          {!isAdmin ? <p style={{display: 'inline', marginLeft: '2vw'}}> Already studied abroad? </p> : null}
          {!isAdmin ? <Link to="/review" style={linkStyle}> Share here.</Link> : null}
          {!isAdmin ? <Button style={signupStyle} variant="outlined" component={Link} to="/account"> My Account </Button> : null}
          <Button style={signupStyle} variant="outlined"
            onClick = {(event) => {
              cookies.remove('email', {'path': '/'});
              cookies.remove('role', {'path': '/'}); }}>
              Log Out </Button>
        </div>
      );
    }

  }

}

export default NavigationBar;
