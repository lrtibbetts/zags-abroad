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
import { Link } from "react-router-dom";

const buttonStyle = {
  margin: '5px'
};

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjects: [], // Subjects in dropdown menu
      listOfFilters : [], // Filters applied by the user
      courseList : [], // Courses matching a user's search
      showMessage : false,
      message: '',
      showLogInPrompt: false,
      photos: []
    }

    this.getAllCourses();

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
  }



  // Remove filter from list of filters and add back to subjects dropdown
  handleDeleteFilter = filter => () => {
    var filters = this.state.listOfFilters;
    for(var i = 0; i < filters.length; i++) {
      if (filter.value === filters[i].value) {
        filters.splice(i, 1);
        this.setState({listOfFilters: filters});
      }
    }
    filters.length > 0 ? this.getCourses() : this.getAllCourses();
    for(var j = 0; j < this.state.subjects.length; j++) {
      var subjects = this.state.subjects;
      if(filter.value < subjects[j].value) {
        subjects.splice(j, 0, filter); // Insert at j, remove 0 items
        this.setState({subjects: subjects});
        return;
      }
    }
  }

  // Remove subject from dropdown menu after it is selected
  handleDeleteSubject(subject) {
    for (var i = 0; i < this.state.subjects.length; i++) {
      if (subject.value === this.state.subjects[i].value) {
        let newSubjects = this.state.subjects;
        newSubjects.splice(i, 1);
        this.setState({subjects: newSubjects});
      }
    }
  }

  // Populate table with relevant courses in list
  formatCourses(data) {
    let courses = [];
    for(var i = 0; i < data.length; i++) {
      let newCourse = {guCourse: data[i].gu_course_number + ": " + data[i].gu_course_name,
        hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
        : data[i].host_course_name, requiresSignature: data[i].signature_needed, id: data[i].id};
      courses.push(newCourse);
    }
    this.setState({courseList: courses});
  }

  // No filters, Pull all courses in program
  getAllCourses() {
    axios.post("https://zagsabroad-backend.herokuapp.com/programcourses", {"program": this.props.name}).then((res) => {
      this.formatCourses(res.data);
    });
  }

  // Filters applied, pull matching courses in program
  getCourses() {
    let params = {
      "program": this.props.name,
      "subjects": this.state.listOfFilters.map((filter) => filter.value),
      "core": []
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

  render() {
    const {photos} =  this.state;
    return (
      <div classname="slider">
      </div>
      <div>
        <div style={{textAlign: 'center'}}>
          <h1>{this.props.name}</h1>
        </div>
        <div style={{marginTop: '10px', marginLeft: '100px', width: '500px'}}>
          <DropdownTextField
            placeholder = "Enter a department"
            id = "departments"
            onChange = { (selectedOption) => {
              let newFilter = {value: selectedOption.value, label: selectedOption.label};
              let filters = this.state.listOfFilters;
              filters.push(newFilter);
              this.setState({listOfFilters: filters});
              this.handleDeleteSubject(newFilter);
              this.getCourses();
            }}
            options = {this.state.subjects}
          />
        </div>
        <div style={{float: 'right', marginRight: '100px'}}>
        </div>
        <div style={{marginLeft: '100px'}}>
          {this.state.listOfFilters.map(filter => {
            return (
              <Chip style={{marginRight: '10px', marginTop: '10px'}}
                key={filter.value}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter.label}
              />
            );
          })}
        </div>
        <h2 style={{marginLeft: '100px'}}> Available Courses: </h2>
        {this.state.listOfFilters.length > 1 && this.state.courseList.length === 0 ?
        <p style={{marginLeft: '100px'}}> No matching courses. Try removing a filter! </p> : null}
        <div style={{marginLeft: '100px', marginRight: '100px'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GU Course</TableCell>
                <TableCell>Host Course</TableCell>
                <TableCell>Requires Signature</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.courseList.map((course) => {
                return (
                  <TableRow key={course.id}>
                    <TableCell>{course.guCourse}</TableCell>
                    <TableCell>{course.hostCourse}</TableCell>
                    <TableCell>{course.requiresSignature}</TableCell>
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
