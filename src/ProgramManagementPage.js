import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import ProgramDetailsForm from './ProgramDetailsForm.js';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { Redirect } from "react-router-dom";

const addButtonStyle = {
  margin: '10px'
};

class ProgramManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddForm: false,
      showEditForm: false,
      programs: [],
      editingProgram: [], // Array with details of program being edited
      showMessage: false,
      message: '',
      columns: [
        {
          name: "Program Name",
          options: {
            display: true
          }
        },
        {
          name: "Location",
          options: {
            display: true
          }
        },
        {
          name: "Program Type",
          options: {
            display: true
          }
        },
        {
          name: "Application Link",
          options: {
            display: true
          }
        },
        {
          name: "Host Institution Link",
          options: {
            display: true
          }
        }
      ]
    }

    // Bind 'this' context to helper functions
    this.loadPrograms = this.loadPrograms.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.populateEditForm = this.populateEditForm.bind(this);
    this.hideEditForm = this.hideEditForm.bind(this);
    this.displayMessage = this.displayMessage.bind(this);

    this.loadPrograms();
  }

  loadPrograms() {
    axios.get("https://zagsabroad-backend.herokuapp.com/adminprograms").then((res) => {
      // Convert array of objects to 2D array
      const programsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let prog = [];
        prog.push(res.data[i]["host_program"]);
        prog.push(res.data[i]["city"]);
        prog.push(res.data[i]["program_type"]);
        prog.push(res.data[i]["application_link"]);
        prog.push(res.data[i]["host_url"]);
        programsToAdd.push(prog);
      }
      this.setState({programs : programsToAdd});
    });
  }

  deleteRows(rowsToDelete) {
    for(let i = 0; i < rowsToDelete.data.length; i++) {
      const index = rowsToDelete.data[i].dataIndex; // dataIndex refers to index in programs array (parallel to ids array)
      const host_program = this.state.programs[index][0];
      var programInfo = { host_program : host_program }
      axios.post("https://zagsabroad-backend.herokuapp.com/deleteprogram", programInfo).then((res) => {
        if(res.data.errno) { // Error deleting the program
          this.displayMessage("Error deleting program");
        } else { // No error, course updated successfully
          this.displayMessage(host_program + "program deleted successfully");
        }
      });
    }
  }

  toggleAddForm() {
    this.setState({showAddForm : !this.state.showAddForm});
    this.loadPrograms();
  }

  populateEditForm(rowData, rowMeta) {
    // Get program details for row clicked
    this.setState({editingProgram: rowData, showEditForm: true});
  }

  hideEditForm() {
    this.setState({showEditForm : false});
    this.loadPrograms();
  }

  displayMessage(message) {
    this.setState({showMessage: true, message: message});
  }

  handleChange = (event, value) => {
    this.setState({value});
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      const options = {
        print: false, // Remove print icon
        download: false,
        viewColumns: false,
        filter: false,
        downloadOptions: {filename: "Program Information.csv"}, // Custom file name
        onRowClick: this.populateEditForm,
        onRowsSelect: () => {this.setState({showEditForm: false})}, // Prevent editing form from popping up when row is "selected" vs. "clicked"
        onRowsDelete: this.deleteRows,
        pagination: false,
        fixedHeader: false, // Headers will move if the user scrolls across the table
        responsive: "scroll" // Table will resize if more columns are added
      };
      return (
        <div style={{textAlign: 'center', margin: '20px'}}>
          <Button variant="contained"
            style={addButtonStyle}
            onClick={this.toggleAddForm}>
            Add Program
          </Button>
          <MUIDataTable
            columns = {this.state.columns}
            data = {this.state.programs}
            options = {options}/>
          {this.state.showAddForm === true ? <ProgramDetailsForm
            program={[]} // Adding a new program, so pass an empty array
            displayMessage={this.displayMessage}
            onClose={this.toggleAddForm}
            title="Add Program"/> : null}
          {this.state.showEditForm === true ? <ProgramDetailsForm
            program={this.state.editingProgram}
            displayMessage={this.displayMessage}
            onClose={this.hideEditForm}
            title="Edit Program"/> : null}
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
        <Redirect to="/"/>
      )
    }
  }
}

export default ProgramManagementPage;
