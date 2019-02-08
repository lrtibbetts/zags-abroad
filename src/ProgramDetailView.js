import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import MultiDropdownTextField from './MultiDropdownTextField.js';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MUIDataTable from "mui-datatables";
import "./ProgramDetailView.css";



const buttonStyle = {
  margin: '5px'
};

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [],
      filters: [],
      courseList : [], // Courses matching a user's search
      searchBy: 'department',
      loading: true,
      showMessage : false,
      message: '',
      showLogInPrompt: false,
      photos: [],
      columns: [
        { name: "ID",
          options: { display: false } },
        { name: "Gonzaga Course" },
        { name: "Host Course" },
        { name: "Signature needed" },
        { name: "Core Designation" },
        { name: "",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <IconButton onClick={(event) => this.saveCourse(value)}
                  color="primary"><AddIcon/>
                </IconButton>
              );
            },
          }
        }
      ],
      surveyColumns: [
        { name: "Name",
          options: { display: false } },
        { name: "Major" },
        { name: "Year" },
        { name: "Classes" },
      ],
      surveys: []
    }

    //getting all of the programs for the dropdown
    axios.post("https://zagsabroad-backend.herokuapp.com/programsubjects", {"program": this.props.name}).then((res) => {
      let subjectsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let subjectName = res.data[i].subject_name.trim(); // Remove any white space
        let subjectCode = res.data[i].subject_code.trim();
        let subjectObj = {value: subjectCode, label: subjectName};
        subjectsToAdd.push(subjectObj);
      }
      this.setState({subjects: subjectsToAdd});
    });

    //getting all of the core for the dropdown
    axios.post("https://zagsabroad-backend.herokuapp.com/programcore", {"program": this.props.name}).then((res) => {
      let coreToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let coreName = res.data[i].core_name.trim(); // Remove any white space
        let coreObj = {value: "CORE: " + coreName, label: coreName};
        coreToAdd.push(coreObj);
      }
      this.setState({core: coreToAdd}, () => {
        // Fetch all courses and photos AFTER state has changed
        this.getAllCourses();
        this.getAllPhotos();
      });
    });

    axios.post("https://zagsabroad-backend.herokuapp.com/programsurveys", {"program": this.props.name}).then((res) => {
      let surveysToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
         let major = res.data[i].major.trim(); // Remove any white space
         let email = ((res.data[i].email) ? res.data[i].email.trim() : ""); //
         let name = ((res.data[i].name) ? res.data[i].name.trim() : ""); //
         let program = res.data[i].program.trim();
         let term = res.data[i].term.trim();
         let year = res.data[i].year.trim();
         let residence = ((res.data[i].residence) ? res.data[i].residence.trim() : ""); //
         let trips = ((res.data[i].trips) ? res.data[i].trips.trim() : ""); //
         let classes = ((res.data[i].classes) ? res.data[i].classes.trim() : ""); //
         let activities = ((res.data[i].activities) ? res.data[i].activities.trim() : ""); //
         let staff = ((res.data[i].staff) ? res.data[i].staff.trim() : ""); //
         let other = ((res.data[i].other) ? res.data[i].other.trim() : ""); //
        surveysToAdd.push(res.data[i]);
      }
      this.setState({surveys: surveysToAdd});
      console.log(this.state.surveys);
    });
  }

  // Populate table with relevant courses in list
  formatCourses(data) {
    let courses = [];
    for(var i = 0; i < data.length; i++) {
      let newCourse = [];
      newCourse.push(data[i].id);
      newCourse.push(data[i].gu_course_number + (data[i].gu_course_name ? ": " + data[i].gu_course_name : ""));
      newCourse.push(data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name :
      data[i].host_course_name);
      newCourse.push(data[i].signature_needed);
      newCourse.push(data[i].core);
      newCourse.push(data[i].id);
      courses.push(newCourse);
    }
    this.setState({courseList: courses, loading: false});
  }

  // No filters, Pull all courses in program
  getAllCourses() {
    this.setState({courseList: [], loading: true})
    axios.post("https://zagsabroad-backend.herokuapp.com/programcourses", {"program": this.props.name}).then((res) => {
      this.formatCourses(res.data);
    });
  }

  // Get all of the photos from a specific program
  getAllPhotos() {
    this.setState({photos: [], loading: true});
    let program = {
      "program": this.props.name
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/programphotos", program).then((res) => {
      let photoList = [];
      for(var i = 0; i < res.data.length; i++) {
        photoList.push(res.data[i]);
      }
      this.setState({photos: photoList, loading: false});
    })
  }

  // Filters applied, pull matching courses in program
  getCourses() {
    this.setState({courseList: [], loading: true})
    let params = {
      "program": this.props.name,
      "core": this.state.filters.filter(filter => filter.value.includes("CORE: ")).map((filter) => filter.label),
      "subjects": this.state.filters.filter(filter => filter.value !== 'core').map((filter) => filter.value)
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/detailsearch", params).then((res) => {
      this.formatCourses(res.data);
    });
  }

  saveCourse(id) {
    let email = this.props.cookies.get('email');
    if(email) {
      // User is logged in
      let params = {
        "email": email,
        "course_id": id
      }
      axios.post("https://zagsabroad-backend.herokuapp.com/savecourse", params).then((res) => {
        if(res.data.code === "ER_DUP_ENTRY") {
          this.setState({showMessage: true, message: "Course already added.  See My Account"});
        } else if(res.data.errno) {
          this.setState({showMessage: true, message: "Error saving course"});
        } else {
          this.setState({showMessage: true, message: "Course saved to My Account"});
        }
      });
    } else {
      // Not logged in
      this.setState({showLogInPrompt: true})
    }
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    }, () => {
      (this.state.filters.length > 0) ? this.getCourses() : this.getAllCourses();
    });
  };

  render() {
    const options = {
      print: false, // Remove print icon
      filter: false,
      search: false,
      download: false,
      viewColumns: false,
      selectableRows: false,
      rowsPerPage: 10, // Default to 10 rows per page
      rowsPerPageOptions: [10, 20, 30],
      responsive: "scroll"
    };
    return (
      <div style={{textAlign: 'center'}}>
        <h1>{this.props.name}</h1>
        <p style={{display: 'inline'}}> Search by: </p>
        <div style={{marginLeft: '10px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <Select autoWidth={true} value={this.state.searchBy}
            onChange = { (event) =>
              this.setState({searchBy : event.target.value})}>
            <MenuItem value='department'> Department </MenuItem>
            <MenuItem value='core'> Core designation </MenuItem>
          </Select>
        </div>
        <div className="search">
          <MultiDropdownTextField
            value = { this.state.filters }
            onChange = { this.handleChange("filters")}
            options = {this.state.searchBy === 'department' ? this.state.subjects : this.state.core}
          />
        </div>
        <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '20px', zIndex: 0, position: 'relative'}}>
          {this.state.loading ? <CircularProgress variant="indeterminate"/> :
          <MUIDataTable
            columns = {this.state.columns}
            data = {this.state.courseList}
            options = {options}/>}
        </div><br/>
        {this.state.courseList.length > 0 ?
        <p style={{fontSize: '13px'}}>
        <b>Note:</b> This list is based on courses GU students have gotten credit
        for in the past, but you may be able to get other courses approved. </p> : null} <br/>
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
          <Dialog id="dialog" open={this.state.showLogInPrompt}>
            <DialogTitle id="simple-dialog-title">You must log in to save a course!</DialogTitle>lo['m
            ;>Z']
            <div>
              <Button style={buttonStyle} variant="contained" component={Link} to="/login">
                Log in
              </Button>
              <Button style={buttonStyle} variant="contained" component={Link} to="/signup">
                Sign up
              </Button>
              <Button style={buttonStyle} variant="contained"
                onClick = {(event) =>
                  this.setState({showLogInPrompt : false})}>
                Close
              </Button>
            </div>
          </Dialog>
      </div>
    );
  }
}

export default ProgramDetailView;
