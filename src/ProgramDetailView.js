import React, { Component } from 'react';
import axios from 'axios';
import MultiDropdownTextField from './MultiDropdownTextField.js';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
      filters: [],
      courseList : [], // Courses matching a user's search
      searchBy: 'department',
      loading: true,
      showMessage : false,
      message: '',
      showLogInPrompt: false,
      photos: [],
      currentIndex: 0,
      translateValue: 0
    }

<<<<<<< HEAD
    this.getAllCourses();

    axios.get("https://zagsabroad-backend.herokuapp.com/coreSubjects", {"program": this.props.name}).then((res) => {
      console.log("HIT CORE SUBJECTS");
    })

=======
>>>>>>> b00308332249ca4b6d93becdc31d9306cbd44af4
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

  // Get all of the photos from a specific program
  getAllPhotos() {
    let program = {
      "program": this.props.name
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/programphotos", program).then((res) => {
      console.log(this.props.name);
      console.log(res.data)
      console.log(program)
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

  handleSize(image) {
    console.log(image.offsetWidth, image.offsetHeight)
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    }, () => {
      (this.state.filters.length > 0) ? this.getCourses() : this.getAllCourses();
    });
  };

  render() {
    const {photos} = this.state;
    return (
      <div style={{textAlign: 'center'}}>
        <h1>{this.props.name}</h1>
        {/*<Gallery photos={
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
        } />;*/}
        <p style={{display: 'inline'}}> Search by: </p>
        <div style={{marginLeft: '10px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <Select autoWidth={true} value={this.state.searchBy}
            onChange = { (event) =>
              this.setState({searchBy : event.target.value})}>
            <MenuItem value='department'> Department </MenuItem>
            <MenuItem value='core'> Core designation </MenuItem>
          </Select>
        </div>
        <div style={{marginLeft: '10px', width: '575px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <MultiDropdownTextField
            value = { this.state.filters }
            onChange = { this.handleChange("filters")}
            options = {this.state.searchBy === 'department' ? this.state.subjects : this.state.core}
          />
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
