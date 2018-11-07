import React, { Component } from 'react';
import MUIDataTable from "mui-datatables"; // https://github.com/gregnb/mui-datatables
import axios from 'axios';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      columns: ['Host Program', 'Host Course Number', 'Host Course Name', 'GU Course Number',
                'GU Course Name', 'Comments', 'Signature needed', 'Department', 'Approved By',
                'Approval Date', 'Approved Until']
    }
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      // Convert array of objects to 2D array
      const coursesToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let equivalency = [];
        for(var field in res.data[0]) {
          equivalency.push(res.data[i][field].toString()); // Access each field in the row object
        }
        coursesToAdd.push(equivalency);
      }
      this.setState({courses : coursesToAdd});
    });
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        filterType: "dropdown",
        responseive: 'scroll'
      };
      return (
        <div>
          <h1> Course Equivalencies </h1>
          <MUIDataTable
            columns = {this.state.columns}
            data = {this.state.courses}
            options = {options}/>
        </div>
      )
    } else {
      return (
        <div>
          <h1> You do not have access to this page! </h1>
        </div>
      )
    }
  }

}

export default AdminPage;
