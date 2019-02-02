import React, { Component } from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { Link } from "react-router-dom";
import MapView from "./MapView.js";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [], // Core designations in dropdown menu
      subjectFilters : [], // Filters applied by the user
      coreFilters: [],
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

    axios.get("https://zagsabroad-backend.herokuapp.com/core").then((res) => {
      let coreToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let core = res.data[i].core_name.trim(); // Remove any white space
        let coreObj = {value: 'core', label: core};
        coreToAdd.push(coreObj);
      }
      this.setState({core: coreToAdd},
          this.getAllPrograms()); // Fetch all programs after state has changed
    });
  }

  // Remove filter from list of filters and add back to dropdown
  handleDeleteFilter = filter => () => {
    if(filter.value === 'core') {
      var filters = this.state.coreFilters;
      for(var i = 0; i < filters.length; i++) {
        if (filter.label === filters[i].label) { // Compare unique core label, not value
          filters.splice(i, 1);
          this.setState({coreFilters: filters});
        }
      }
      (filters.length + this.state.subjectFilters.length) > 0 ? this.getPrograms() : this.getAllPrograms();
      for(var j = 0; j < this.state.core.length; j++) {
        var core = this.state.core;
        if(filter.label < core[j].label) {
          core.splice(j, 0, filter); // Insert at j, remove 0 items
          this.setState({core: core});
          return;
        }
      }
    } else {
      filters = this.state.subjectFilters;
      for(var k = 0; k < filters.length; k++) {
        if (filter.value === filters[k].value) {
          filters.splice(k, 1);
          this.setState({subjectFilters: filters});
        }
      }
      (filters.length + this.state.coreFilters.length) > 0 ? this.getPrograms() : this.getAllPrograms();
      for(var m = 0; m < this.state.subjects.length; m++) {
        var subjects = this.state.subjects;
        if(filter.value < subjects[m].value) {
          subjects.splice(m, 0, filter); // Insert at j, remove 0 items
          this.setState({subjects: subjects});
          return;
        }
      }
    }
  }

  // Remove item from dropdown menu after it is selected
  handleDeleteMenuItem(item) {
    if(item.value === 'core') {
      for (var i = 0; i < this.state.core.length; i++) {
        if (item.label === this.state.core[i].label) { // Compare unique core label, not value
          let newCore = this.state.core;
          newCore.splice(i, 1);
          this.setState({core: newCore});
        }
      }
    } else {
      for (var j = 0; j < this.state.subjects.length; j++) {
        if (item.value === this.state.subjects[j].value) {
          let newSubjects = this.state.subjects;
          newSubjects.splice(j, 1);
          this.setState({subjects: newSubjects});
        }
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
          : data[i].host_course_name, requiresSignature: data[i].signature_needed, core: data[i].core};
        courses.push(newCourse);
        if(i < data.length) {
          i++;
        }
      }
      let programObj = {programName: programName, courses: courses};
      // Only display programs with courses for all filters
      let matchingProgram = true;
      for(let j = 0; j < this.state.subjectFilters.length; j++) {
        let hasMatchingResult = courses.some( (course) =>
          course['guCourse'].substring(0, 4) === this.state.subjectFilters[j].value );
        if(!hasMatchingResult) {
          matchingProgram = false;
          break;
        }
      }
      for(let k = 0; k < this.state.coreFilters.length; k++) {
        let hasMatchingResult = courses.some( (course) =>
          course['core'].includes(this.state.coreFilters[k].label) );
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
    var filters = {
      "subjects": this.state.subjectFilters.map((filter) => filter.value),
      "core": this.state.coreFilters.map((filter) => filter.label)
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/filterbysubjectcore", filters).then((res) => {
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
            <MenuItem value='core'> Core Designation </MenuItem>
          </Select>
        </div>
        <div style={{marginLeft: '10px', width: '575px', display: 'inline-block', verticalAlign: 'bottom'}}>
          <DropdownTextField
            placeholder = {this.state.searchBy === 'department' ? "E.g. Computer Science" : "E.g. Global Studies"}
            id = "departments"
            onChange = { (selectedOption) => {
              let newFilter = {value: selectedOption.value, label: selectedOption.label};
              if(this.state.searchBy === 'department') {
                let subjFilters = this.state.subjectFilters;
                subjFilters.push(newFilter);
                this.setState({subjectFilters: subjFilters})
              } else {
                let coreFilters = this.state.coreFilters;
                coreFilters.push(newFilter);
                this.setState({coreFilters: coreFilters})
              }
              this.handleDeleteMenuItem(newFilter);
              this.getPrograms();
            }}
            options = {this.state.searchBy === 'department' ? this.state.subjects : this.state.core}
          />
        </div>
        <div>
          {this.state.subjectFilters.map(filter => {
            return (
              <Chip style={{marginRight: '10px', marginTop: '10px'}}
                key={filter.value}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter.label}
              />
            );
          })}
          {this.state.coreFilters.map(filter => {
            return (
              <Chip style={{marginRight: '10px', marginTop: '10px'}}
                key={filter.label}
                onDelete={this.handleDeleteFilter(filter)}
                deleteIcon={<CancelIcon/>}
                label={filter.label}
              />
            );
          })}
        </div>
        <br/>
        <div style={{display: 'inline-block', textAlign: 'justify', float: 'right', marginRight: '20px'}}>
          <MapView programs={this.state.programList.map((program) => program.programName)}/>
        </div>
        <div style={{display: 'inline-block', float: 'left', width: '55%', marginLeft: '20px'}}>
          {this.state.loading ? <div id="loading">
            <CircularProgress variant="indeterminate"/> </div>: null}
          {(this.state.subjectFilters.length + this.state.coreFilters.length) > 0 && this.state.programList.length === 0
            && !this.state.loading ? <p> No matching programs. Try removing a filter! </p> : null}
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
                          <TableCell>Core Designation</TableCell>
                          <TableCell>Requires Signature</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {program.courses.map((course, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{course.guCourse}</TableCell>
                              <TableCell>{course.hostCourse}</TableCell>
                              <TableCell>{course.core}</TableCell>
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
        <p style={{fontSize: '13px', display: 'inline-block', float: 'left', marginLeft: '20px'}}>
        <b>Note:</b> This list is based on courses GU students have gotten credit
        for in the past, but you may be able to get other courses approved. </p> : null} <br/>
      </div>
    );
  }
}

export default MainPage;
