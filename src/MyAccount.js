/*
This file contains code for the student user account page. It includes the
saved courses (grouped by study abroad program).

Backend calls:
/deletedcourses
/deleteaccountcourse
/accountcourses
*/

import axios from 'axios';
import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.cookies.get('email'),
      courses: [],
      programs : [],
      showMessage: false,
      message: ''
    }
    this.getCourses();

    // Check if any courses have been deleted by an admin. If so, delete from saved_courses
    axios.post("https://zagsabroad-backend.herokuapp.com/deletedcourses", {email: this.state.email}).then((res) => {
      for(var i = 0; i < res.data.length; i++) {
        axios.post("https://zagsabroad-backend.herokuapp.com/deleteaccountcourse",
        {email: this.state.email, id: res.data[i].course_id}).then((res) => {
          console.log(res.data);
        });
      }
      if(res.data.length === 1) {
        this.setState({showMessage: true, message: "Note: 1 previously saved course was removed by an administrator"});
      } else if (res.data.length > 1) {
        this.setState({showMessage: true, message: "Note: " + res.data.length +
        " previously saved courses were removed by an administrator"});
      }
    });
  }

  formatCourses(data) {

    if (data.length === 0){
      this.setState({programs: ''})
      this.setState({courses: ''});
    } else {
      var i = 0;
      let courses = [];
      let allCourses = [];
      let programs = [];
      let programName = data[i].host_program;
      let loc = data[i].city;
      while(i < data.length) {
        programName = data[i].host_program;
        loc = data[i].city;
        while(i < data.length && data[i].host_program === programName) {
          let newCourse = {guCourse: data[i].gu_course_number + ": " + data[i].gu_course_name,
            hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
            : data[i].host_course_name, requiresSignature: data[i].signature_needed, id: data[i].id,
            hostProgram: data[i].host_program};
          courses.push(newCourse);
          if(i < data.length) {
            i++;
          }
        }
        let programObj = {courses: courses, name: programName, city: loc};
        programs.push(programObj);
        allCourses.push(courses);
        courses = [];
      }
        this.setState({programs: programs});
        this.setState({courses: allCourses});
    }
  }

  getCourses() {
    axios.post("https://zagsabroad-backend.herokuapp.com/accountcourses", {email: this.state.email}).then((res) => {
      this.formatCourses(res.data);
    });
  }

  deleteCourse(id) {
    let params = {
      email: this.state.email,
      id: id
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/deleteaccountcourse", params).then((res) => {
      res.data.errno ? this.setState({showMessage: true, message: "Error deleting course"}) :
      this.setState({showMessage: true, message: "Course deleted successfully"},
      this.getCourses());
    });
  }

  render() {
    let role = this.props.cookies.get('role');
    // Only allow general users who are logged in to access MyAccount
    if(role === 'user' && this.state.programs !== '') {
    return(
      <div style={{textAlign: 'center', padding: '20px'}}>
        <h2 style={{color: '#06274F'}}>My Account</h2>
            {this.state.programs.map((program, index) => {
              return (
                <div style={{display: 'inline-block', textAlign: 'center', overflow: 'auto'}}>
                <h3 style={{color: '#06274F'}}>{program.name} - {program.city}</h3>
                <Table key = {program.name}>
                  <TableHead>
                    <TableRow>
                      <TableCell>GU Course</TableCell>
                      <TableCell>Host Course</TableCell>
                      <TableCell>Requires Signature</TableCell>
                      <TableCell>  </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {program.courses.map((course) => {
                      return (
                        <TableRow key={course.id}>
                          <TableCell>{course.guCourse}</TableCell>
                          <TableCell>{course.hostCourse}</TableCell>
                          <TableCell>{course.requiresSignature}</TableCell>
                          <TableCell>{<IconButton onClick={(event) => {this.deleteCourse(course.id)}}
                            color="primary"><DeleteIcon/></IconButton>}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                </div>
              )

            })}
        <Snackbar message={this.state.message}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.showMessage}
          onClose={(event) =>
            this.setState({showMessage: false})}
          action={
          <IconButton
            onClick={(event) =>
              this.setState({showMessage: false})}>
          <CloseIcon/> </IconButton>}/>
      </div>
    );
  } else if (role === 'user'){
    return(
      <div style={{textAlign: 'center', padding: '20px'}}>
        <h2>My Account</h2>
        <h4>No saved courses at this time!</h4>
        <Snackbar message={this.state.message}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.showMessage}
          onClose={(event) =>
            this.setState({showMessage: false})}
          action={
          <IconButton
            onClick={(event) =>
              this.setState({showMessage: false})}>
          <CloseIcon/> </IconButton>}/>
      </div>
    );
  } else {
      // Not logged in
      return(
        <Redirect to="/"/>
      );
    }
  }
}

export default MyAccount;
