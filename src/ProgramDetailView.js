import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import MultiDropdownTextField from './MultiDropdownTextField.js';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MUIDataTable from "mui-datatables";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import "./ProgramDetailView.css";
import ReviewsDisplay from './ReviewsDisplay.js';

const buttonStyle = {
  margin: '5px'
};

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);
    const savedCourses = this.getSavedCourses();
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
      columns: [
        { name: "",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              let match = false;
              for(var i = 0; i < savedCourses.length; i++) {
                if (savedCourses[i] === tableMeta.rowData[0]) {
                  match = true;
                }
              }
              // Course is a saved course for logged in user
              if(match) {
                return (
                  <IconButton
                    onClick={(event) => {
                      this.deleteCourse(value);
                      this.setState({savedCoursesList: this.getSavedCourses()});
                    }}
                    color="primary"><DoneIcon/>
                  </IconButton>
                );
              } else {
                return (
                  <IconButton
                    onClick={(event) => {
                      this.saveCourse(value);
                      this.setState({savedCoursesList: this.getSavedCourses()});
                    }}
                    color="primary"><AddIcon/>
                  </IconButton>
                );
              }
            }}},
        { name: "Gonzaga Course" },
        { name: "Host Course" },
        { name: "Signature needed" },
        { name: "Core Designation" }]
    }

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
      console.log('LINK', res.data[0].application_link);
      this.setState({applicationLink: res.data[0].application_link});
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
      courses.push(newCourse);
    }
    this.setState({courseList: courses, loading: false});
  }

  // alkjfdlksdlfalflajsdf;af
  getSavedCourses() {
    let email = this.props.cookies.get('email');
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
          this.setState({showMessage: true, message: "Course already added.  See \"My Account\""});
        } else if(res.data.errno) {
          this.setState({showMessage: true, message: "Error saving course"});
        } else {
          this.setState({showMessage: true, message: "Course saved to \"My Account\""});
        }
      });
    } else {
      // Not logged in
      this.setState({showLogInPrompt: true})
    }
  }

  deleteCourse(id) {
    let params = {
      email: this.props.cookies.get('email'),
      id: id
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/deleteaccountcourse", params).then((res) => {
      res.data.errno ? this.setState({showMessage: true, message: "Error deleting course"}) :
      this.setState({showMessage: true, message: "Course removed from \"My Account\""},
      this.getCourses());
    });
  }

  handleChange = name => value => {
    this.setState({ [name]: value }, () => {
      (this.state.filters.length > 0) ? this.getCourses() : this.getAllCourses();
    });
  };

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'user' || cookies.get('role') === undefined) {
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
      const maxWidth = Math.max.apply(null, this.state.photos.map((photo) =>
        parseInt(photo.width)));
      return (
        <div className="detail">
          <h1>{this.props.name}</h1>
          <div className="photos">
          <a href={this.state.applicationLink} target="_blank" rel="noopener noreferrer">Apply Here!</a>
          {this.state.loading ? <CircularProgress variant="indeterminate"/> :
          (this.state.photos.length > 0 ?
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
            </Carousel> : null)}
          </div>
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
          <div className="list">
            {this.state.loading ? null :
            <MUIDataTable
              columns = {this.state.columns}
              data = {this.state.courseList}
              options = {options}/>}<br/>
          </div>
          <div className="header">
            <h2> Program Reviews </h2>
          </div>
          <ReviewsDisplay program={this.props.name}/><br/>
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
