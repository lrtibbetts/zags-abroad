import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import axios from 'axios';

class AdminPage extends Component {
  //TODO: make sure only authenticated users can access this page
  constructor(props) {
    super(props);
    this.state = {
      courses: []
    }
  }

  componentDidMount() {
    axios.get("http://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.setState({courses: res.data});
    });
  }

  render() {
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
  }

}

export default AdminPage;
