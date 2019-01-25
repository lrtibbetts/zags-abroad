import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

const buttonStyle = {
  margin: '10px'
}

const linkStyle = {
  color: 'black',
  marginRight: '10px'
}

const headerStyle = {
  color: 'black',
  textDecoration: 'none',
  display: 'inline-block',
  paddingRight: '300px'
}

class NavigationBar extends Component {
  render() {
    const cookies = this.props.cookies;
    const loggedIn = cookies.get('email');
    const isAdmin = cookies.get('role') === 'admin';
    if(!loggedIn) {
      return (
        <div style={{textAlign: 'center'}}>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          <p style={{display: 'inline'}}> Already studied abroad? </p>
          <Link to="/review" style={linkStyle}>Share here.</Link>
          <Button style={buttonStyle} variant="outlined" component={Link} to="/signup">
            Sign Up
          </Button>
          <Button style={buttonStyle} variant="outlined" component={Link} to="/login">
            Log In
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{textAlign: 'center'}}>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          {!isAdmin ? <p style={{display: 'inline'}}> Already studied abroad? </p> : null}
          {!isAdmin ? <Link to="/review" style={linkStyle}> Share here.</Link> : null}
          {!isAdmin ? <Button style={buttonStyle} variant="outlined" component={Link} to="/account"> My Account </Button> : null}
          <Button style={buttonStyle} variant="outlined"
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
