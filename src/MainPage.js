import React, { Component } from 'react';
import MultiDropdownTextField from './MultiDropdownTextField.js';
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
import { Redirect} from "react-router-dom";
import MapView from "./MapView.js";
import "./MainPage.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [], // Core designations in dropdown menu
      filters: [],
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
        let coreObj = {value: "CORE: " + core, label: core};
        coreToAdd.push(coreObj);
      }
      this.setState({core: coreToAdd},
          this.getAllPrograms()); // Fetch all programs after state has changed
    });
  }

  formatPrograms(data) {
    var programsToAdd = [];
    var i = 0;
    while(i < data.length) {
      let programName = data[i].host_program;
      let courses = [];
      let location = data[i].city;
      while(i < data.length && data[i].host_program === programName) {
        let newCourse = {guCourse: (data[i].gu_course_name ? (data[i].gu_course_number + ": " + data[i].gu_course_name)
          : data[i].gu_course_number),
          hostCourse: data[i].host_course_number ? data[i].host_course_number + ": " + data[i].host_course_name
          : data[i].host_course_name, requiresSignature: data[i].signature_needed, core: data[i].core};
        courses.push(newCourse);
        if(i < data.length) {
          i++;
        }
      }
      let programObj = {programName: programName, courses: courses, location: location};
      // Only display programs with courses for all filters
      let matchingProgram = true;
      for(let j = 0; j < this.state.filters.length; j++) {
        if(this.state.filters[j].value.includes("CORE: ")) {
          let hasMatchingResult = courses.some( (course) =>
            course['core'].includes(this.state.filters[j].label) );
          if(!hasMatchingResult) {
            matchingProgram = false;
            break;
          }
        } else {
          let hasMatchingResult = courses.some( (course) =>
            course['guCourse'].substring(0, 4) === this.state.filters[j].value );
          if(!hasMatchingResult) {
            matchingProgram = false;
            break;
          }
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
      "core": this.state.filters.filter(filter => filter.value.includes("CORE: ")).map((filter) => filter.label),
      "subjects": this.state.filters.filter(filter => !filter.value.includes("CORE: ")).map((filter) => filter.value)
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/mainsearch", filters).then((res) => {
      this.formatPrograms(res.data);
    });
  }

  handleChange = name => value => {
    this.setState({
      [name]: value,
    }, () => {
      (this.state.filters.length > 0) ? this.getPrograms() : this.getAllPrograms();
    });
  };

render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'user' || cookies.get('role') === undefined) {
      return (
        <div className ="wrapper">
          <div className ="search-bar-wrapper">
            <p style={{marginTop: '15px', display: 'inline'}}> Search by: </p>
            <div style={{marginTop: '4px', marginLeft: '10px', display: 'inline-block', verticalAlign: 'bottom'}}>
              <Select autoWidth={true} value={this.state.searchBy}
                onChange = { (event) =>
                  this.setState({searchBy : event.target.value})}>
                <MenuItem value='department'> Department </MenuItem>
                <MenuItem value='core'> Core Designation </MenuItem>
              </Select>
            </div>
            <div className="search-bar">
              <MultiDropdownTextField
                id = "search"
                value = { this.state.filters }
                onChange = { this.handleChange("filters")}
                options = {this.state.searchBy === 'department' ? this.state.subjects : this.state.core}/>
            </div>
          </div>
          <div className="expansion-map-wrapper">
            <div className="program-list">
              {this.state.loading ? <div id="loading" style={{textAlign: "center"}}>
                <CircularProgress variant="indeterminate"/> </div>: null}
              {this.state.filters.length > 0 && this.state.programList.length === 0
                && !this.state.loading ? <p> No matching programs. Try removing a filter! </p> : null}
              {this.state.programList.map(program => {
                return (
                  <ExpansionPanel key={program.programName}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <div>
                        <div style={{textAlign: 'left'}}><b>{program.programName}</b></div>
                        <div style={{textAlign: 'left', fontSize: 'small', fontWeight: 300 }}>{program.location}</div>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails >
                      <div style={{display: 'inline-block', textAlign: 'left', overflow: 'auto'}}>
                        <div style={{display: 'inline'}}>
                          <a href={`/program/${program.programName}`} target="_blank" rel="noopener noreferrer"
                          style={{textDecoration: 'none', marginRight: '20px'}}>
                          <Button variant="outlined" color="primary">
                            Learn more
                          </Button>
                          </a>
                          <a href="/review" style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" color="primary">
                            Submit a review
                          </Button>
                          </a>
                        </div>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <Tooltip placement="bottom" title={"Course listing at Gonzaga"}>
                                <TableCell>GU Course</TableCell>
                              </Tooltip>
                              <Tooltip placement="bottom" title={"Course listing abroad"}>
                                <TableCell>Host Course</TableCell>
                              </Tooltip>
                              <Tooltip placement="bottom" title={"Any core requirements the course fulfills"}>
                                <TableCell>Core Designation</TableCell>
                              </Tooltip>
                              <Tooltip placement="bottom" title={"Whether or not the department chair must sign off"}>
                                <TableCell>Requires Signature</TableCell>
                              </Tooltip>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {program.courses.map((course, index) => {
                              let core = course.core.trim();
                              return (
                                <TableRow key={index}>
                                  <TableCell>{course.guCourse}</TableCell>
                                  <TableCell>{course.hostCourse}</TableCell>
                                  <TableCell>{core.trim().substring(0, core.length - 1)}</TableCell>
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
            </div>
            <div className="map">
              <MapView programs={this.state.programList.map((program) => program.programName)}/>
              {!this.state.loading ?
              <div>
                <p style={{display: 'inline'}}> Interested in Gonzaga in Florence? </p>
                <a href="https://studyabroad.gonzaga.edu/index.cfm?FuseAction=PublicDocuments.View&File_ID=27240"
                target = "_blank" rel="noopener noreferrer" style={{color: 'black'}}>Click here.</a>
              </div> : null}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Redirect to="/admin"/>
      );
    }
  }
}

export default MainPage;
