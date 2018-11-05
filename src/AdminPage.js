import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import axios from 'axios';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: []
    }
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.setState({courses: res.data});
    });
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div>
          <MuiThemeProvider>
            <div>
              <h1> Course Equivalencies: </h1>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> Host program </TableCell>
                    <TableCell> Host course number </TableCell>
                    <TableCell> Host course name </TableCell>
                    <TableCell> GU course number </TableCell>
                    <TableCell> GU course name </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.courses.map(course => {
                    return(
                      <TableRow key={this.state.courses.indexOf(course)}>
                        <TableCell> {course.host_program} </TableCell>
                        <TableCell> {course.host_course_number} </TableCell>
                        <TableCell> {course.host_course_name} </TableCell>
                        <TableCell> {course.gu_course_number} </TableCell>
                        <TableCell> {course.gu_course_name} </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </MuiThemeProvider>
        </div>
      )
    } else {
      return (
        <div>
          <h1> You do not have access to this page! </h1>
        </div>
      )
    }
  }

}

export default AdminPage;
