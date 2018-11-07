import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MUIDataTable from "mui-datatables"; // https://github.com/gregnb/mui-datatables
import axios from 'axios';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [["AIFS"]],
      columns: ['Host Program', 'Host Course Number', 'Host Course Name', 'GU Course Number',
                'GU Course Name', 'Comments', 'Signature needed', 'Department', 'Approved By',
                'Approval Date', 'Approved Until']
    }
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      // Convert array of objects to 2D array
      for(let i = 0; i < 10; i++) {
        let equivalency = []
        for(var field in res.data[0]) {
          equivalency.push(res.data[i][field]); // Access each field in the row object
        }
        this.state.courses.push(equivalency);
      }
    });
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        filterType: 'checkbox',
      };
      console.log(this.state.courses);
      const courses = this.state.courses;
      return (
        <div>
          <MuiThemeProvider>
            <div>
              <MUIDataTable
                title = "Course Equivalencies"
                columns = {this.state.columns}
                data = {courses}
                options = {options}/>
            </div>
          </MuiThemeProvider>
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
