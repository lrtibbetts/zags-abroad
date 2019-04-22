import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import "./NavigationBar.css";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import FAQDialog from "./FAQDialog.js";

const leftButtonStyle = {
  marginTop: '20px',
  marginRight: '2vw',
  fontWeight: '700'
}

const rightButtonStyle = {
  marginTop: '20px',
  marginRight: '2vw',
  float: 'right',
  fontWeight: '700'
}

const linkStyle = {
  color: '#06274F'
}

const headerStyle = {
  color: '#06274F',
  textDecoration: 'none',
  marginLeft: '2vw',
  display: 'inline-block'
}

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {openDialogue: false};
    this.handleOpenDialogue = this.handleOpenDialogue.bind(this);
    this.handleCloseDialogue = this.handleCloseDialogue.bind(this);
  }

  handleOpenDialogue() {
    this.setState({
      openDialogue: true
    })
  }

  handleCloseDialogue() {
    this.setState({
      openDialogue: false
    })
  }

  render() {
    const cookies = this.props.cookies;
    const loggedIn = cookies.get('email');
    const isAdmin = cookies.get('role') === 'admin';
    if(!loggedIn) {
      return (
        <div style={{backgroundColor: 'rgb(94, 138, 180, 0.5)'}}>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          <img style={{position: 'absolute', marginLeft: '-25px', marginTop: '10px'}}
          src={require('./spires-logo.png')} alt="" width={58} height={45.5}/>
          <div className="link">
            <p style={{display: 'inline', marginLeft: '4vw', color: '#06274F'}}> Already studied abroad? </p>
            <Link to="/review" style={linkStyle}>Share here.</Link>
          </div>
          <div className ="button-wrapper">
            <Button style={leftButtonStyle}
              onClick={this.handleOpenDialogue}>
              FAQ
            </Button>
            <Dialog open={this.state.openDialogue}
              onBackdropClick={() => this.setState({openDialogue: false})}>
              <DialogTitle style={{margin: '0 auto'}}> Frequently asked questions: </DialogTitle>
              <FAQDialog/>
            </Dialog>
            <Button style={leftButtonStyle} variant="outlined" component={Link} to="/login">
              Log In
            </Button>
            <Button style={rightButtonStyle} variant="outlined" component={Link} to="/signup">
              Sign Up
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{backgroundColor: 'rgb(94, 138, 180, 0.5)'}}>
          <Link to={(cookies.get('role') === 'admin') ? "/admin" : "/"}
            style={headerStyle}><h2> Zags Abroad </h2></Link>
          <img style={{position: 'absolute', marginLeft: '-25px', marginTop: '10px'}}
          src={require('./spires-logo.png')} alt="" width={58} height={45.5}/>
          <div className="logged-in-link">
            {!isAdmin ? <p style={{display: 'inline', marginLeft: '4vw', color: '#06274F'}}> Already studied abroad? </p> : null}
            {!isAdmin ? <Link to="/review" style={linkStyle}> Share here.</Link> : null}
          </div>
          <div className="button-wrapper">
          {!isAdmin ?
            <div style={{display: 'inline'}}>
              <Button style={leftButtonStyle}
                onClick={this.handleOpenDialogue}>
                FAQ
              </Button>
              <Dialog open={this.state.openDialogue}
                onBackdropClick={() => this.setState({openDialogue: false})}>
                <DialogTitle style={{margin: '0 auto'}}> Frequently asked questions: </DialogTitle>
                <FAQDialog/>
              </Dialog>
              <Button style={leftButtonStyle} variant="outlined" component={Link} to="/account"> My Account </Button>
            </div>
             : null}
            <Button style={rightButtonStyle} variant="outlined"
              onClick = {(event) => {
                cookies.remove('email', {'path': '/'});
                cookies.remove('role', {'path': '/'}); }}>
                Log Out
            </Button>
          </div>
        </div>
      );
    }
  }
}

export default NavigationBar;
