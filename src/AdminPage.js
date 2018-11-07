import React, { Component } from 'react';
import MUIDataTable from "mui-datatables"; // https://github.com/gregnb/mui-datatables
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';

const addButtonStyle = {
  margin: '10px'
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      // Customize column properties
      columns: [
        {
          name: "Host Program",
        },
        {
          name: "Host Course Number",
          options: {
            filter: false
          }
        },
        {
          name: "Host Course Name",
          options: {
            filter: false
          }
        },
        {
          name: "GU Course Number"
        },
        {
          name: "GU Course Name"
        },
        {
          name: "Comments",
          options: {
            display: false,
            filter: false
          }
        },
        {
          name: "Signature needed",
          options: {
            display: false,
            filter: false
          }
        },
        {
          name: "Approved by",
          options: {
            display: false,
            filter: false
          }
        },
        {
          name: "Approval date",
          options: {
            display: false,
            filter: false
          }
        },
        {
          name: "Approved until",
          options: {
            display: false,
            filter: false
          }
        },
        {
          name: "Department",
          options: {
            display: false
          }
        }
      ]
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

  deleteRows() {
    // Call backend API
    console.log("deleted");
  }

  displayEditingForm() {
    // Render editing form with a save button
    // Call backend API after user presses save
    console.log("editing");
  }

  addCourse() {
    // Render editing form with a submit button
    // Call backend API after user presses submit
    console.log("add course");
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        // Customization of data table
        filterType: "dropdown", // Apply filters via dropdown menus
        print: false, // Remove print icon
        downloadOptions: {filename: "Course Equivalencies.csv"},
        onRowsDelete: this.deleteRows,
        onRowClick: this.displayEditingForm,
        responsive: "scroll" // Table will resize if more columns are added
      };
      return (
        <div>
          <MuiThemeProvider>
            <div>
              <h1> Course Equivalencies </h1>
              <RaisedButton label="Add"
                style={addButtonStyle}
                onClick = {this.addCourse}/>
              <MUIDataTable
                columns = {this.state.columns}
                data = {this.state.courses}
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
