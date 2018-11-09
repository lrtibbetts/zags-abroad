import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput : '',
      dataSource : ['CPSC', 'BUSI', 'MUSC', 'PHIL', 'MATH','ETC'],
      courses : [],
      filteredCourses :[],
      currentCourse : '',
      newArray : [],
      counter : 0
    }
    //backend API
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.setState({courses: res.data});
    });
  }

  setFilteredCourses(counter, currentCourse, array) {
    var filteredArray = []
    var n = this.state.userInput.length
    while (counter < this.state.courses.length) {
      currentCourse = this.state.courses[counter].gu_course_number.substring(0,n);
      if (currentCourse === this.state.userInput) {
          filteredArray = filteredArray.concat(this.state.courses[counter])
      }
      counter++;
    }
    this.setState({filteredCourses: filteredArray})
  }



  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1> Welcome! </h1>
            <AutoComplete
              hintText = 'Enter a deparment here (uppercase)'
              dataSource={this.state.dataSource}
              onChange={
                (event, value) => this.setState({userInput : event.currentTarget.value},
                  () => this.setFilteredCourses(0, [], [])
              )}
              onSelect={ (event, value) => this.setState({userInput : event.currentTarget.value},
                () => this.setFilteredCourses(0, [], [])
            )}
            />
            <h1> Search Results: </h1>
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
                {this.state.filteredCourses.map(course => {
                  return(
                    <TableRow key={this.state.filteredCourses.indexOf(course)}>
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
    );
  }
}

export default MainPage;
