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

class ProgramDetailView extends Component {
  constructor(props) {
    super(props);
    let program = this.props.name;

    this.state = {
      subjects: [], // Subjects in dropdown menu
      listOfFilters : [], // Filters applied by the user
      courseList : [] // Programs matching a user's search
    }

    axios.get("https://zagsabroad-backend.herokuapp.com/subjects").then((res) => {
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
    this.getCourses(); // Update program results based on new state
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

  getCourses() {
    var subjects = {
      "subjects": this.state.listOfFilters.map((filter) => filter.value),
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/filterbysubject", subjects).then((res) => {
      console.log(res.data);
      let courses = [];
      for(var i = 0; i < res.data.length; i++) {
        if(res.data[i].host_program === this.props.name) {
          let newCourse = {guCourse: res.data[i].gu_course_number + ": " + res.data[i].gu_course_name,
            hostCourse: res.data[i].host_course_number ? res.data[i].host_course_number + ": " + res.data[i].host_course_name
              : res.data[i].host_course_name,
            requiresSignature: res.data[i].signature_needed};
          courses.push(newCourse);
        }
      }
      console.log(courses);
      this.setState({courseList: courses});
    });
    
  }

  render() {
    return (
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
        <div style={{marginLeft: '100px', marginRight: '660px'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GU Course</TableCell>
                <TableCell>Host Course</TableCell>
                <TableCell>Requires Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.courseList.map((course, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{course.guCourse}</TableCell>
                    <TableCell>{course.hostCourse}</TableCell>
                    <TableCell>{course.requiresSignature}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div><br/>
        {this.state.listOfFilters.length > 0 && this.state.courseList.length > 0 ?
        <p style={{fontSize: '13px', marginLeft: '100px', marginRight: '660px'}}>
        <b>Note:</b> This list is based on courses GU students have gotten credit
        for in the past, but you may be able to get other courses approved. </p> : null} <br/>
      </div>
    );
  }
}

export default ProgramDetailView;
