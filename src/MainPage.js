import React, { Component } from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import DropdownTextField from './DropdownTextField.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from "react-router-dom";
import MapView from "./MapView.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown menu
      listOfFilters : [], // Filters applied by the user
      programList : [], // Programs matching a user's search
      loading: true,
      searchBy: 'department'
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

    this.getAllPrograms();
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
    filters.length > 0 ? this.getPrograms() : this.getAllPrograms();
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

  formatPrograms(data) {
    var programsToAdd = [];
    var i = 0;
    while(i < data.length) {
      let programName = data[i].host_program;
      let courses = [];
      while(i < data.length && data[i].host_program === programName) {
        let newCourse = {guCourse: data[i].gu_course_number + ": " + data[i].gu_course_name,
          hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
          : data[i].host_course_name, requiresSignature: data[i].signature_needed};
        courses.push(newCourse);
        if(i < data.length) {
          i++;
        }
      }
      let programObj = {programName: programName, courses: courses};
      // Only display programs with courses for all filters
      let matchingProgram = true;
      for(let j = 0; j < this.state.listOfFilters.length; j++) {
        let hasMatchingResult = courses.some( (course) => course['guCourse'].substring(0, 4) === this.state.listOfFilters[j].value );
        if(!hasMatchingResult) {
          matchingProgram = false;
          break;
        }
      }
      if(matchingProgram) {
        programsToAdd.push(programObj);
      }
    }
    this.setState({programList: programsToAdd, loading: false});
  }

  getAllPrograms() {
    this.setState({programList: [], loading: true})
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.formatPrograms(res.data);
    });
  }

  getPrograms() {
    this.setState({programList: [], loading: true})
    var subjects = {
      "subjects": this.state.listOfFilters.map((filter) => filter.value)
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/filterbysubject", subjects).then((res) => {
      this.formatPrograms(res.data);
    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <p style={{marginTop: '15px', display: 'inline'}}> Search by: </p>
        <div style={{marginTop: '15px', marginLeft: '10px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <Select autoWidth={true} value={this.state.searchBy}
            onChange = { (event) =>
              this.setState({searchBy : event.target.value})}>
            <MenuItem value='department'> Department </MenuItem>
            <MenuItem value='core'> Core designation </MenuItem>
          </Select>
        </div>
        <div style={{marginLeft: '10px', width: '575px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <DropdownTextField
            placeholder = {this.state.searchBy === 'department' ? "E.g. Computer Science" : "E.g. Global Studies"}
            id = "departments"
            onChange = { (selectedOption) => {
              let newFilter = {value: selectedOption.value, label: selectedOption.label};
              let filters = this.state.listOfFilters;
              filters.push(newFilter);
              this.setState({listOfFilters: filters});
              this.handleDeleteSubject(newFilter);
              this.getPrograms();
            }}
            options = {this.state.subjects}
          />
        </div>
        <div>
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
        <div style={{marginTop: '20px', display: 'inline-block', textAlign: 'justify'}}>
          <MapView programs={this.state.programList.map((program) => program.programName)}/>
        </div>
        <h2> Available Programs: </h2>
        {this.state.loading ? <div id="loading">
          <CircularProgress variant="indeterminate"/> </div>: null}
        {this.state.listOfFilters.length > 0 && this.state.programList.length === 0
          && !this.state.loading ? <p> No matching programs. Try removing a filter! </p> : null}
        <div style={{marginLeft:'10%', marginRight: '10%'}}>
          {this.state.programList.map(program => {
            return (
              <ExpansionPanel key={program.programName}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <b>{program.programName}</b>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{display: 'inline-block', textAlign: 'left', overflow: 'auto'}}>
                    <Link to={`/program/${program.programName}`} target="_blank">Learn More</Link>
                    <Table>
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
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </div><br/>
        {this.state.programList.length > 0 ?
        <p style={{fontSize: '13px'}}>
        <b>Note:</b> This list is based on courses GU students have gotten credit
        for in the past, but you may be able to get other courses approved. </p> : null} <br/>
      </div>
    );
  }
}

export default MainPage;
