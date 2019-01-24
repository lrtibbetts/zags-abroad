import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from "react-router-dom";

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: []
    }
    this.getCourses();
  }

  formatCourses(data) {
    let courses = [];
    for(var i = 0; i < data.length; i++) {
      let newCourse = {guCourse: data[i].gu_course_number + ": " + data[i].gu_course_name,
        hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
        : data[i].host_course_name, requiresSignature: data[i].signature_needed, id: data[i].id,
        hostProgram: data[i].host_program};
      courses.push(newCourse);
    }
    this.setState({courses: courses});
  }

  getCourses() {
    let email = this.props.cookies.get('email');
    axios.post("https://zagsabroad-backend.herokuapp.com/accountcourses", {email: email}).then((res) => {
      this.formatCourses(res.data);
    });
  }

  render() {
    let email = this.props.cookies.get('email');
    if(email) {
    return(
      <div style={{textAlign: 'center', padding: '20px'}}>
        <h2>My Account</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Program</TableCell>
              <TableCell>GU Course</TableCell>
              <TableCell>Host Course</TableCell>
              <TableCell>Requires Signature</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.courses.map((course) => {
              return (
                <TableRow key={course.id}>
                  <TableCell>{course.hostProgram}</TableCell>
                  <TableCell>{course.guCourse}</TableCell>
                  <TableCell>{course.hostCourse}</TableCell>
                  <TableCell>{course.requiresSignature}</TableCell>
                  <TableCell>{<IconButton onClick={(event) => {console.log('delete')}}
                    aria-label="Add" color="primary"><DeleteIcon/></IconButton>}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
