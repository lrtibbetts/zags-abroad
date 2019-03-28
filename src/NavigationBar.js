import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import "./NavigationBar.css";

const buttonStyle = {
  margin: '5px',
}

const loginStyle = {
  marginRight: '2vw',
  marginTop: '20px',
  float: 'right',
}

const signupStyle = {
  marginRight: '3vw',
  marginTop: '20px',
  float: 'right',
}

const linkStyle = {
  color: 'black',
  fontSize: 'small',
}

const headerStyle = {
  color: 'black',
  textDecoration: 'none',
  display: 'inline-block',
  marginLeft: '25px'
}


class NavigationBar extends Component {
  render() {
    const cookies = this.props.cookies;
    const loggedIn = cookies.get('email');
    const isAdmin = cookies.get('role') === 'admin';
    if(!loggedIn) {
      return (
        <div className ="flexDirection">
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          <p style={{display: 'inline', fontSize: 'small', fontWeight: 300, marginLeft: '3vw'}}> Already studied abroad? </p>
          <Link to="/review" style={linkStyle}>Share here.</Link>
          <Button style={signupStyle} variant="outlined" component={Link} to="/signup">
            Sign Up
          </Button>
          <Button style={loginStyle} variant="outlined" component={Link} to="/login">
            Log In
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
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
