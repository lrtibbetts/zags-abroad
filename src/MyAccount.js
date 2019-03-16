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
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.cookies.get('email'),
      courses: [],
      showMessage: false,
      message: ''
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
    if(role === 'user') {
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
                  <TableCell>{<IconButton onClick={(event) => {this.deleteCourse(course.id)}}
                    color="primary"><DeleteIcon/></IconButton>}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
