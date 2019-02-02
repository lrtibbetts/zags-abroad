import React, { Component } from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import DropdownTextField from './DropdownTextField.js';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import Gallery from 'react-photo-gallery';
import Dimensions from 'react-dimensions';

const buttonStyle = {
  margin: '5px'
};

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [],
      subjectFilters : [], // Filters applied by the user
      coreFilters: [],
      courseList : [], // Courses matching a user's search
      showMessage : false,
      message: '',
      showLogInPrompt: false,
      photos: [],
      loading: true
    }

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

    axios.get("https://zagsabroad-backend.herokuapp.com/core").then((res) => {
      let coreToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let coreName = res.data[i].core_name.trim(); // Remove any white space
        let coreObj = {value: 'core', label: coreName};
        coreToAdd.push(coreObj);
      }
      this.setState({core: coreToAdd},
          this.getAllCourses()); // Fetch all courses after state has changed
    });
  }

  // Remove filter from list of filters and add back to subjects dropdown
  handleDeleteFilter = filter => () => {
    if(filter.value === 'core') {
      var filters = this.state.coreFilters;
      for(var i = 0; i < filters.length; i++) {
        if (filter.label === filters[i].label) { // Compare unique core label, not value
          filters.splice(i, 1);
          this.setState({coreFilters: filters});
        }
      }
      (filters.length + this.state.subjectFilters.length) > 0 ? this.getCourses() : this.getAllCourses();
      for(var j = 0; j < this.state.core.length; j++) {
        var core = this.state.core;
        if(filter.label < core[j].label) {
          core.splice(j, 0, filter); // Insert at j, remove 0 items
          this.setState({core: core});
          return;
        }
      }
    } else {
      filters = this.state.subjectFilters;
      for(var k = 0; k < filters.length; k++) {
        if (filter.value === filters[k].value) {
          filters.splice(k, 1);
          this.setState({subjectFilters: filters});
        }
      }
      (filters.length + this.state.coreFilters.length) > 0 ? this.getCourses() : this.getAllCourses();
      for(var m = 0; m < this.state.subjects.length; m++) {
        var subjects = this.state.subjects;
        if(filter.value < subjects[m].value) {
          subjects.splice(m, 0, filter); // Insert at j, remove 0 items
          this.setState({subjects: subjects});
          return;
        }
      }
    }
  }

  // Remove item from dropdown menu after it is selected
  handleDeleteMenuItem(item) {
    if(item.value === 'core') {
      for (var i = 0; i < this.state.core.length; i++) {
        if (item.label === this.state.core[i].label) { // Compare unique core label, not value
          let newCore = this.state.core;
          newCore.splice(i, 1);
          this.setState({core: newCore});
        }
      }
    } else {
      for (var j = 0; j < this.state.subjects.length; j++) {
        if (item.value === this.state.subjects[j].value) {
          let newSubjects = this.state.subjects;
          newSubjects.splice(j, 1);
          this.setState({subjects: newSubjects});
        }
      }
    }
  }

  // Populate table with relevant courses in list
  formatCourses(data) {
    let courses = [];
    for(var i = 0; i < data.length; i++) {
      let newCourse = {guCourse: data[i].gu_course_number + ": " + data[i].gu_course_name,
        hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
        : data[i].host_course_name, requiresSignature: data[i].signature_needed, id: data[i].id, core: data[i].core};
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

  // Filters applied, pull matching courses in program
  getCourses() {
    this.setState({courseList: [], loading: true})
    let params = {
      "program": this.props.name,
      "subjects": this.state.subjectFilters.map((filter) => filter.value),
      "core": this.state.coreFilters.map((filter) => filter.label)
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

  handleSize(image) {
    console.log(image.offsetWidth, image.offsetHeight)
  }

  render() {
    const {photos} = this.state;
    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <h1>{this.props.name}</h1>
        </div>
        <Gallery photos={
          [
            {
              src: 'https://res.cloudinary.com/zagsabroad/image/upload/v1548782294/pymfdeenpur9vjyqfewc.jpg',
              ref: this.handleSize('https://res.cloudinary.com/zagsabroad/image/upload/v1548782294/pymfdeenpur9vjyqfewc.jpg'),
            },
            {
              src: 'https://res.cloudinary.com/zagsabroad/image/upload/v1548372970/zlqliqgffizjnfqpaaqy.jpg',
              ref: this.handleSize('https://res.cloudinary.com/zagsabroad/image/upload/v1548372970/zlqliqgffizjnfqpaaqy.jpg')
            }
          ]
        } />;
        <div style={{marginTop: '10px', marginLeft: '100px', width: '500px'}}>
          <DropdownTextField
            placeholder = "Enter a department"
            id = "departments"
            onChange = { (selectedOption) => {
              let newFilter = {value: selectedOption.value, label: selectedOption.label};
              if(this.state.searchBy === 'department') {
                let subjFilters = this.state.subjectFilters;
                subjFilters.push(newFilter);
                this.setState({subjectFilters: subjFilters})
              } else {
                let coreFilters = this.state.coreFilters;
                coreFilters.push(newFilter);
                this.setState({coreFilters: coreFilters})
              }
              this.handleDeleteMenuItem(newFilter);
              this.getCourses();
            }}
            options = {this.state.searchBy === 'department' ? this.state.subjects : this.state.core}
          />
        </div>
        <div style={{float: 'right', marginRight: '100px'}}>
        </div>
        <div style={{marginLeft: '100px'}}>
          {this.state.subjectFilters.map(filter => {
            return (
              <Chip style={{marginRight: '10px', marginTop: '10px'}}
                key={filter.value}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter.label}
              />
            );
          })}
          {this.state.coreFilters.map(filter => {
            return (
              <Chip style={{marginRight: '10px', marginTop: '10px'}}
                key={filter.label}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter.label}
              />
            );
          })}
        </div>
        <div style={{marginLeft: '100px', marginRight: '100px', marginTop: '20px'}}>
        {this.state.loading ? <div id="loading">
          <CircularProgress variant="indeterminate"/> </div>: null}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GU Course</TableCell>
                <TableCell>Host Course</TableCell>
                <TableCell>Requires Signature</TableCell>
                <TableCell>Core Designation</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.courseList.map((course, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{course.guCourse}</TableCell>
                    <TableCell>{course.hostCourse}</TableCell>
                    <TableCell>{course.requiresSignature}</TableCell>
                    <TableCell>{course.core}</TableCell>
                    <TableCell>{<IconButton onClick={(event) => this.saveCourse(course.id)}
                      color="primary"><AddIcon/></IconButton>}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div><br/>
        {this.state.courseList.length > 0 ?
        <p style={{fontSize: '13px', marginLeft: '100px', marginRight: '100px'}}>
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
            <DialogTitle id="simple-dialog-title">You must log in to save a course!</DialogTitle>
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
