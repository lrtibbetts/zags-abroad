import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import "./NavigationBar.css";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

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
            <Button style={leftButtonStyle} variant="outlined"
              onClick={this.handleOpenDialogue}>
              FAQ
            </Button>
            <Dialog open={this.state.openDialogue}
              onBackdropClick={() => this.setState({openDialogue: false})}>
              <DialogTitle style={{margin: '0 auto'}}> Frequently asked questions: </DialogTitle>
              <div style={{marginTop: '5px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px', textAlign: 'center'}}>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What is Zags Abroad? </p>
                <p className = "faq">
                 Zags Abroad is a senior design project from 2018-19. The goal is to help students find a study abroad
                 program that fits their interests and fulfills academic requirements more easily!
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What is the "share here" link? </p>
                <p className = "faq">
                 The Share Here link takes you to a review form where you can provide feedback for your
                 study abroad experience. Your responses to certain questions is visible on the program
                 pages on our website. This allows you to share your experiences with other students and
                 provide a more personal insight on what studying abroad is like.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> How should I select a program? </p>
                <p className = "faq">
                  Only you can know what program is best suited for your personal needs. However, our application allows you
                  to filter through programs based on what kind of courses you may need to take so that you can find programs
                  that fit your academic needs.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What are the pluses next to course names on the program pages? </p>
                <p className = "faq">
                  When you click on the plus sign, it saves that course to your account. You can view your saved courses
                  on your My Account page. They are grouped by program so that you can compare different programs easily
                  and keep track of what you want to take during your study abroad.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What is a core designation? </p>
                <p className = "faq">
                 Core designations indicate that a course fulfills a specific part of the core curriculum at Gonzaga.
                 Please consult your advisor if you have more questions about core requirements.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Which class will be listed on my transcript? </p>
                <p className = "faq">
                  The Gonzaga course title will be listed on your transcript.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What does ‘Requires Signature’ mean? </p>
                <p className = "faq">
                  A "YES" means that you must get a signature from the department chair of the course
                  subject. For example, to get a Biology course approved, you must get a
                  signature from the department chair of Biology.
                  If the department type of the host course is different
                  from that of the Gonzaga course, get the signature from the chair of the Gonzaga course department.
                  Signature forms can be found in the study abroad office.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Where is Gonzaga in Florence? </p>
                <p className = "faq">
                  Florence is managed separately from other study abroad programs. You can find information on Florence<span>&nbsp;</span>
                  <a href="https://studyabroad.gonzaga.edu/index.cfm?FuseAction=PublicDocuments.View&File_ID=27240"
                  target = "_blank" rel="noopener noreferrer" style={{color: 'black'}}>here.</a>
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Where are short-term and faculty-led programs? </p>
                <p className = "faq">
                  Those programs change from semester to semester and usually
                  include slightly different application procedures. We suggest asking
                  your professors or department chairs about these programs.
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Are these all the classes I can take abroad? </p>
                <p className = "faq">
                  These are the courses that Gonzaga students have gotten credit for in the past.
                  You can take other classes at these universities!
                </p>
                <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Are these the only semester-long programs? </p>
                <p className = "faq">
                  These are all of Gonzaga's sponsored study abroad semester-long programs, but you can work with the study
                  abroad office to get a non-sponsored program approved.
                </p>
              </div>
            </Dialog>
            <Button style={rightButtonStyle} variant="outlined" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button style={leftButtonStyle} variant="outlined" component={Link} to="/login">
              Log In
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
          <Button style={rightButtonStyle} variant="outlined"
            onClick = {(event) => {
              cookies.remove('email', {'path': '/'});
              cookies.remove('role', {'path': '/'}); }}>
              Log Out </Button>
          {!isAdmin ? <Button style={rightButtonStyle} variant="outlined" component={Link} to="/account"> My Account </Button> : null}
        </div>
      );
    }
  }
}

export default NavigationBar;
