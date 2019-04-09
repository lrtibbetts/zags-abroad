import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ProgramDetailView.css";
import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import MUIDataTable from "mui-datatables";
import MultiDropdownTextField from './MultiDropdownTextField.js';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ReviewsDisplay from './ReviewsDisplay.js';
import SaveButton from './SaveButton.js';
import TableFooter from '@material-ui/core/TableFooter';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';

const buttonStyle = {
  margin: '5px',
  fontWeight: '700'
};

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);
    let email = this.props.cookies.get('email');
    let savedCourses = []
    if(email) {
      savedCourses = this.getSavedCourses(email);
    }
    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [],
      filters: [],
      courseList : [], // Courses matching a user's search
      savedCoursesList: savedCourses, // IDs of courses saved to logged in account
      applicationLink: '',
      searchBy: 'department',
      loading: true,
      showMessage : false,
      message: '',
      showLogInPrompt: false,
      photos: [],
      page: 0,
      rowsPerPage: 10
    }

    this.refresh = this.refresh.bind(this);

    // Getting all of the programs for the dropdown
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

    // Getting all of the core designations for the dropdown
    axios.post("https://zagsabroad-backend.herokuapp.com/programcore", {"program": this.props.name}).then((res) => {
      let coreToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let coreName = res.data[i].core_name.trim(); // Remove any white space
        let coreObj = {value: "CORE: " + coreName, label: coreName};
        coreToAdd.push(coreObj);
      }
      this.setState({core: coreToAdd}, () => {
        // Fetch all courses and photos AFTER state has changed
        this.getAllPhotos();
        this.getAllCourses();
      });
    });

    // Get application link for Program
    axios.post("https://zagsabroad-backend.herokuapp.com/applicationlink", {"host_program": this.props.name}).then((res) => {
      this.setState({applicationLink: res.data[0].application_link});
    });
  }

  // Populate table with relevant courses in list
  formatCourses(data) {
    let courses = [];
    for(var i = 0; i < data.length; i++) {
      let newCourse = {id: data[i].id, guCourse: (data[i].gu_course_name ?
        (data[i].gu_course_number + ": " + data[i].gu_course_name) : data[i].gu_course_number),
        hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
        : data[i].host_course_name, requiresSignature: data[i].signature_needed, core: data[i].core};
      courses.push(newCourse);
    }
    this.setState({courseList: courses, loading: false});
  }

  getSavedCourses(email) {
    let savedCourses = [];
    if(email) {
      axios.post("https://zagsabroad-backend.herokuapp.com/accountcourses", {email: email}).then((res) => {
        for(var i = 0; i < res.data.length; i++) {
          savedCourses.push(res.data[i].id);
        }
      });
    }
    return savedCourses;
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
        let width = res.data[i].width;
        let height = res.data[i].height;
        if (width > height && width > 500) {
          // Landscape image: calculate scaled width and height
          let scaledHeight = (height / width) * 500;
          photoList.push({url: res.data[i].url, height: scaledHeight, width: 500});
        } else if (height > width && height > 400) {
          // Portrait image: calculate scaled width and height
          let scaledWidth = (width / height) * 400;
          photoList.push({url: res.data[i].url, height: 400, width: scaledWidth});
        } else {
          photoList.push({url: res.data[i].url, height: res.data[i].height, width: res.data[i].width});
        }
      }
      this.setState({photos: photoList, loading: false});
    });
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

  isCourseSaved(id) {
    return this.state.savedCoursesList.includes(id);
  }

  refresh(email) {
    let savedCourses = this.getSavedCourses(email);
    this.setState({savedCoursesList: savedCourses});
  }

  saveCourse = (id, email) => {
    if(email) {
      // User is logged in
      let params = {
        "email": email,
        "course_id": id
      }
      axios.post("https://zagsabroad-backend.herokuapp.com/savecourse", params).then((res) => {
        if(res.data.code === "ER_DUP_ENTRY") {
          this.setState({showMessage: true, message: "Course already added.  See \"My Account\""});
        } else if(res.data.errno) {
          this.setState({showMessage: true, message: "Error saving course"});
        } else {
          this.setState({showMessage: true, message: "Course saved to \"My Account\""}, () => {
            this.refresh(email);
          });
        }
      });
    } else {
      // Not logged in
      this.setState({showLogInPrompt: true})
    }
  }

  deleteCourse = (id, email) => {
    if(email) {
      let params = {
        email: email,
        id: id
      }
      axios.post("https://zagsabroad-backend.herokuapp.com/deleteaccountcourse", params).then((res) => {
        res.data.errno ? this.setState({showMessage: true, message: "Error deleting course"}) :
        this.setState({showMessage: true, message: "Course removed from \"My Account\""}, () => {
          this.refresh(email);
        });
      });
    } else {
      // Not logged in
      this.setState({showLogInPrompt: true})
    }
  }

  handleChange = name => value => {
    this.setState({ [name]: value }, () => {
      (this.state.filters.length > 0) ? this.getCourses() : this.getAllCourses();
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  render() {
    const cookies = this.props.cookies;
    const { rowsPerPage, page, courseList } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, courseList.length - page * rowsPerPage);
    if(cookies.get('role') === 'user' || cookies.get('role') === undefined) {
      const maxWidth = Math.max.apply(null, this.state.photos.map((photo) =>
        parseInt(photo.width)));
      return (
        <div className="detail">
          <div style={{textAlign: 'center'}}>
            <h1>{this.props.name}</h1>
          </div>
          {this.state.loading ? <div style={{textAlign: 'center'}}> <CircularProgress variant="indeterminate"/> </div> :
          <div>
            <div className="app">
              <a href={this.state.applicationLink} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Button variant="outlined" color="primary" style={buttonStyle}> Apply Here </Button>
              </a>
            </div>
            <div className="photos">
              {this.state.photos.length > 0 ?
                <Carousel
                  showThumbs={false}
                  dynamicHeight={true}
                  width={maxWidth + 'px'}>
                  {this.state.photos.map((photo) => {
                    return(
                      <div key={photo.url} style={{paddingLeft: (maxWidth - photo.width) / 2,
                      paddingRight: (maxWidth - photo.width) / 2}}>
                        <img src={photo.url} height={photo.height} width={photo.width} alt=""/>
                      </div>
                    );
                  })}
                </Carousel> : null}
            </div>
            <div className ="search-wrapper">
              <p className="label"> Search by: </p>
              <div className="select">
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
            </div>
            <div className="list">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> </TableCell>
                    <Tooltip placement="bottom" title={"Course listing at Gonzaga"}>
                      <TableCell>GU Course</TableCell>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"Course listing abroad"}>
                      <TableCell>Host Course</TableCell>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"Any core requirements the course fulfills"}>
                      <TableCell>Core Designation</TableCell>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"Whether or not the department chair must sign off"}>
                      <TableCell>Requires Signature</TableCell>
                    </Tooltip>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(course => {
                    let core = course.core.trim();
                    return (
                      <TableRow key={course.id}>
                        <TableCell><SaveButton id={course.id} email={cookies.get('email')}
                        isSaved={cookies.get('email') ? this.isCourseSaved(course.id) : false}
                        saveCourse={this.saveCourse} deleteCourse={this.deleteCourse}/></TableCell>
                        <TableCell>{course.guCourse}</TableCell>
                        <TableCell>{course.hostCourse}</TableCell>
                        <TableCell>{core.trim().substring(0, core.length - 1)}</TableCell>
                        <TableCell>{course.requiresSignature}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      colSpan={3}
                      count={courseList.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table><br/>
            </div>
            <h2> Program Reviews </h2>
            <ReviewsDisplay program={this.props.name}/><br/>
          </div>}
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
    } else {
      return (
        <Redirect to="/admin"/>
      );
    }
  }
}

export default ProgramDetailView;
