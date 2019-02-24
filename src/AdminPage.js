import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CourseEquivalencyPage from './CourseEquivalencyPage.js';
import ProgramReviewsApprovalPage from './ProgramReviewsApprovalPage.js';
import ProgramManagementPage from './ProgramManagementPage.js';
import AdminAccountManagementPage from './AdminAccountManagementPage.js';
import { Redirect } from "react-router-dom";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2
    }
  }

  handleChange = (event, value) => {
    this.setState({value: value});
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
              <Tab label="Program Reviews" />
              <Tab label="Programs" />
              <Tab label="Admin Accounts" />
            </Tabs>
          </AppBar>
          {value === 0 &&
            <div>
              <h1> Course Equivalencies </h1>
              <CourseEquivalencyPage cookies = {this.props.cookies}/>
            </div>}
          {value === 1 &&
            <div>
              <h1>Program Reviews</h1>
              <ProgramReviewsApprovalPage cookies = {this.props.cookies}/>
            </div>}
          {value === 2 && <div><h1>Programs</h1>
            <ProgramManagementPage cookies = {this.props.cookies}/>
          </div>}
          {value === 3 && <div><h1>Admin Accounts</h1>
            <AdminAccountManagementPage cookies = {this.props.cookies} />
          </div>}
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
