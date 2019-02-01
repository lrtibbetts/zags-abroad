import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CourseEquivalencyPage from './CourseEquivalencyPage.js'
import { Redirect } from "react-router-dom";

// This function allows us to manipulate the spacing of the tab bar
function TabContainer(props) {
  return (
    <Typography>
      {props.children}
    </Typography>
  );
}

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }

  }

  handleChange = (event, value) => {
    this.setState({value});
  }

  render() {
    const {value} = this.state;
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center'}}>
          <AppBar position="static">
            <Tabs value={value} centered onChange={this.handleChange}>
              <Tab label="Course Equivalencies" />
              <Tab label="Programs" />
              <Tab label="Program Reviews" />
              <Tab label="Admin Accounts" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><h1> Course Equivalencies </h1>
            <CourseEquivalencyPage cookies = {this.props.cookies}/>
          </TabContainer>}
          {value === 1 && <TabContainer>
              <h1>Programs</h1><p> Manage study abroad program information here</p>
            </TabContainer>}
          {value === 2 && <TabContainer><h1>Program Reviews</h1>
            <p> Approve program reviews submitted by students here</p></TabContainer>}
          {value === 3 && <TabContainer><h1>Admin Accounts</h1>
            <p> Grant administrative access to other users here</p></TabContainer>}
        </div>
      );
    } else {
        return (
          <Redirect to="/"/>
        );
      }

  }
}

export default AdminPage;
