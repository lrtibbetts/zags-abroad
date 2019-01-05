import React, { Component } from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import DropdownTextField from './DropdownTextField.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const margins = {
  marginTop: '50px',
  marginLeft: '200px',
  marginRight: '200px'
}

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown menu
      listOfFilters : [], // Filters applied by the user
      programList : [] // Programs matching a user's search
    }

    axios.get("https://zagsabroad-backend.herokuapp.com/subjects").then((res) => {
      let subjectsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let subjectName = res.data[i].subject_name.trim(); // Remove any white space
        let subjectObj = {value: subjectName, label: subjectName};
        subjectsToAdd.push(subjectObj);
      }
      this.setState({subjects: subjectsToAdd});
    });
  }

  // Remove filter from list of filters and add back to subjects dropdown
  handleDeleteFilter = filter => () => {
    var filters = this.state.listOfFilters;
    for(var i = 0; i < filters.length; i++) {
      if (filter === filters[i]) {
        filters.splice(i, 1);
        this.setState({listOfFilters: filters});
      }
    }
    this.getPrograms(); // Update program results based on new state
    for(var j = 0; j < this.state.subjects.length; j++) {
      var subjects = this.state.subjects;
      if(filter < subjects[j].value) {
        subjects.splice(j, 0, {value: filter, label: filter}); // Insert at j, remove 0 items
        this.setState({subjects: subjects});
        return;
      }
    }
  }

  // Remove subject from dropdown menu after it is selected
  handleDeleteSubject(subject) {
    for (var i = 0; i < this.state.subjects.length; i++) {
      if (subject === this.state.subjects[i].value) {
        let newSubjects = this.state.subjects;
        newSubjects.splice(i, 1);
        this.setState({subjects: newSubjects});
      }
    }
  }

  getPrograms() {
    var subjects = {
      "subjects": this.state.listOfFilters
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/filterbysubject", subjects).then((res) => {
      var programsToAdd = [];
      var i = 0;
      while(i < res.data.length) {
        let programName = res.data[i].host_program;
        let courses = [];
        while(i < res.data.length && res.data[i].host_program === programName) {
          // Add to current courses array
          let newCourse = {guCourse: res.data[i].gu_course_number + ": " + res.data[i].gu_course_name,
            hostCourse: res.data[i].host_course_number ? res.data[i].host_course_number + ": " + res.data[i].host_course_name
            : res.data[i].host_course_name,
            requiresSignature: res.data[i].signature_needed};
          courses.push(newCourse);
          if(i < res.data.length) {
            i++;
          }
        }
        let programObj = {programName: programName, courses: courses};
        programsToAdd.push(programObj);
      }
      this.setState({programList: programsToAdd});
    });
  }

  render() {
    return (
      <div>
        <div style={margins}>
          <DropdownTextField
            placeholder = "Enter a department"
            id = "departments"
            onChange = { (selectedOption) => {
              let newFilter = selectedOption.value;
              let filters = this.state.listOfFilters;
              filters.push(newFilter);
              this.setState({listOfFilters: filters});
              this.handleDeleteSubject(newFilter);
              this.getPrograms();
            }}
            options = {this.state.subjects}
          />
        </div><br/>
        <div>
          {this.state.listOfFilters.map(filter => {
            return (
              <Chip
                key={filter}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter}
              />
            );
          })}
        </div><br/>
        <h1> Available programs: </h1>
        <div style={margins}>
          {this.state.programList.map(program => {
            return (
              <ExpansionPanel key={program.programName}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{program.programName}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    <Table className={program}>
                      <TableHead>
                        <TableRow>
                          <TableCell>GU Course</TableCell>
                          <TableCell>Host Course</TableCell>
                          <TableCell>Requires Signature</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {program.courses.map((course, index) => {
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
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </div><br/>
      </div>
    );
  }
}

export default MainPage;
