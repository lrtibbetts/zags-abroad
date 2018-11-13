import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
// library code: https://github.com/gregnb/mui-datatables
// npm docs: https://www.npmjs.com/package/mui-datatables
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CourseDetailsForm from './CourseDetailsForm.js';
import axios from 'axios';

const addButtonStyle = {
  margin: '10px'
};

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddForm: false,
      showEditForm: false,
      courses: [],
      ids: [], // Array to store ids internally
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
          name: "GU Course Number",
          options: {
            filter: false
          }
        },
        {
          name: "GU Course Name",
          options: {
            filter: false
          }
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
      const idsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let equivalency = [];
        for(var field in res.data[0]) {
          if(field === "id") {
            idsToAdd.push(res.data[i][field]);
          } else {
            equivalency.push(res.data[i][field]); // Access each field in the row object
          }
        }
        coursesToAdd.push(equivalency);
      }
      this.setState({courses : coursesToAdd, ids: idsToAdd});
    });

    // Bind 'this' context to helper functions
    this.deleteRows = this.deleteRows.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.rowSelected = this.rowSelected.bind(this);
  }

  deleteRows(rowsToDelete) {
    for(let i = 0; i < rowsToDelete.data.length; i++) {
      const index = rowsToDelete.data[i].dataIndex; // dataIndex refers to index in courses array (parallel to ids array)
      const id = this.state.ids[index];
      var courseInfo = {
        id : id
      }
      // Call backend API
      axios.post("https://zagsabroad-backend.herokuapp.com/deletecourse", courseInfo).then((res) => {
        console.log(res.data);
      });
    }
  }

  toggleEditForm() {
    this.setState({showEditForm : !this.state.showEditForm});
  }

  toggleAddForm() {
    this.setState({showAddForm : !this.state.showAddForm});
  }

  rowSelected() {
    this.setState({showEditForm : false});
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        // Customization of data table
        filterType: "multiselect", // Apply filters via dropdown menus
        print: false, // Remove print icon
        downloadOptions: {filename: "Course Equivalencies.csv"}, // Custom file name
        onRowsSelect: this.rowSelected, // Prevent editing form from popping up when row is "selected" vs. "clicked"
        onRowsDelete: this.deleteRows,
        onRowClick: this.toggleEditForm,
        rowsPerPage: 10, // Default to 20 rows per page
        rowsPerPageOptions: [10, 50, 100],
        fixedHeader: false, // Headers will move if the user scrolls across the table
        responsive: "scroll" // Table will resize if more columns are added
      };
      return (
        <div>
          <MuiThemeProvider>
            <div>
              <h1> Course Equivalencies </h1>
              <RaisedButton label="Add"
                style={addButtonStyle}
                onClick={this.toggleAddForm}/>
              <MUIDataTable
                columns = {this.state.columns}
                data = {this.state.courses}
                options = {options}/>
              {this.state.showAddForm === true ? <CourseDetailsForm
                onClose={this.toggleAddForm}
                title="Add Course Equivalency"/> : null}
              {this.state.showEditForm === true ? <CourseDetailsForm
                // TODO: pass current course details as props
                onClose={this.toggleEditForm}
                title="Edit Course Equivalency"/> : null}
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
