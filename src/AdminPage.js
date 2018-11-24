import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import CourseDetailsForm from './CourseDetailsForm.js';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
      editingCourseId: '', // Id of course being edited
      editingCourse: [], // Array with details of course being edited
      showMessage: false,
      message: '',
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
          name: "Core",
          options: {
            display: false,
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

    // Bind 'this' context to helper functions
    this.loadCourses = this.loadCourses.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.populateEditForm = this.populateEditForm.bind(this);
    this.hideEditForm = this.hideEditForm.bind(this);
    this.displayMessage = this.displayMessage.bind(this);

    this.loadCourses();
  }

  loadCourses() {
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
  }

  deleteRows(rowsToDelete) {
    for(let i = 0; i < rowsToDelete.data.length; i++) {
      const index = rowsToDelete.data[i].dataIndex; // dataIndex refers to index in courses array (parallel to ids array)
      const id = this.state.ids[index];
      var courseInfo = {
        id : id
      }
      axios.post("https://zagsabroad-backend.herokuapp.com/deletecourse", courseInfo).then((res) => {
        if(res.data.errno) { // Error deleting the course
          this.displayMessage("Error deleting course");
        } else { // No error, course updated successfully
          this.displayMessage("Course deleted successfully");
        }
      });
    }
  }

  toggleAddForm() {
    this.setState({showAddForm : !this.state.showAddForm});
    this.loadCourses();
  }

  populateEditForm(rowData, rowMeta) {
    // Get course details for row clicked
    let id = this.state.ids[rowMeta.dataIndex]; // Get course id
    this.setState({editingCourseId: id, editingCourse: rowData, showEditForm: true});
  }

  hideEditForm() {
    this.setState({showEditForm : false});
    this.loadCourses();
  }

  displayMessage(message) {
    this.setState({showMessage: true, message: message});
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        filterType: "multiselect", // Apply multiple filters via dropdown menus
        print: false, // Remove print icon
        downloadOptions: {filename: "Course Equivalencies.csv"}, // Custom file name
        onRowClick: this.populateEditForm,
        onRowsSelect: () => {this.setState({showEditForm: false})}, // Prevent editing form from popping up when row is "selected" vs. "clicked"
        onRowsDelete: this.deleteRows,
        rowsPerPage: 20, // Default to 20 rows per page
        rowsPerPageOptions: [20, 50, 100],
        fixedHeader: false, // Headers will move if the user scrolls across the table
        responsive: "scroll" // Table will resize if more columns are added
      };
      return (
        <div>
          <h1> Course Equivalencies </h1>
          <Button variant="contained"
            style={addButtonStyle}
            onClick={this.toggleAddForm}>
            Add
          </Button>
          <MUIDataTable
            columns = {this.state.columns}
            data = {this.state.courses}
            options = {options}/>
          {this.state.showAddForm === true ? <CourseDetailsForm
            course={[]} // Adding a new course, so pass an empty array
            displayMessage={this.displayMessage}
            onClose={this.toggleAddForm}
            title="Add Course Equivalency"/> : null}
          {this.state.showEditForm === true ? <CourseDetailsForm
            courseId={this.state.editingCourseId}
            course={this.state.editingCourse}
            displayMessage={this.displayMessage}
            onClose={this.hideEditForm}
            title="Edit Course Equivalency"/> : null}
          <Snackbar message={this.state.message}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.showMessage}
            onClose={(event) =>
              this.setState({showMessage: false})}
            autoHideDuration={3000} // Automatically hide message after 3 seconds (3000 ms)
            action={
            <IconButton
              onClick={(event) =>
                this.setState({showMessage: false})}>
            <CloseIcon/> </IconButton>}/>
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
