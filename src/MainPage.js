/*
This file contains code for the main page. It includes filtering functionality,
the interactive map (imported from MapView.js), FAQ, and the programs list.

Backend API calls:
/subjects
/core
/courses
/mainsearch
*/

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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

const buttonStyle = {
  margin: '5px',
  fontWeight: '700'
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown menu
      core: [], // Core designations in dropdown menu
      filters: [],
      programList : [], // Programs matching a user's search
      loading: true,
      showFAQ: false,
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
            <p style={{marginTop: '15px', display: 'inline', color: '#06274F', fontFamily: 'Adelle-Bold'}}> Search by: </p>
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
              {this.state.loading ? <div id="loading" style={{textAlign: "center", paddingTop: '20px'}}>
                <CircularProgress variant="indeterminate"/> </div>:
              <h3 style={{color: '#06274F'}}>Current Programs:</h3>}
              {this.state.filters.length > 0 && this.state.programList.length === 0
                && !this.state.loading ? <p> No matching programs. Try removing a filter! </p> : null}
              {this.state.programList.map(program => {
                return (
                  <ExpansionPanel key={program.programName}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <div>
                        <div style={{textAlign: 'left', color: '#06274F'}}><b>{program.programName}</b></div>
                        <div style={{textAlign: 'left', fontSize: 'small', fontWeight: 300 }}>{program.location}</div>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails >
                      <div style={{display: 'inline-block', textAlign: 'left', overflow: 'auto'}}>
                        <div style={{display: 'inline'}}>
                          <a href={`/program/${program.programName}`} target="_blank" rel="noopener noreferrer"
                          style={{textDecoration: 'none', marginRight: '20px'}}>
                          <Button variant="outlined" color="primary" style={buttonStyle}>
                            Learn more
                          </Button>
                          </a>
                          <a href={`/review/${program.programName}`}  style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" color="primary" style={buttonStyle}>
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
                <p style={{display: 'inline-block', marginTop: '10px'}}> Interested in Gonzaga in Florence? </p>
                <a href="https://studyabroad.gonzaga.edu/index.cfm?FuseAction=PublicDocuments.View&File_ID=27240"
                target = "_blank" rel="noopener noreferrer" style={{color: 'black'}}><span>&nbsp;</span>Click here.</a>
                <Button style={{fontWeight: '700', marginTop: '10px', display: 'inline', float: 'right'}}
                  onClick = {(event) =>
                    this.setState({showFAQ: true})
                  }> FAQ
                </Button>
              </div>
              : null}
              <Dialog open={this.state.showFAQ}
                onBackdropClick={() => this.setState({showFAQ: false})}>
                <DialogTitle style={{margin: '0 auto'}}> Frequently asked questions: </DialogTitle>
                <div style={{marginTop: '5px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px', textAlign: 'center'}}>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What is Zags Abroad? </p>
                  <p className = "faq">
                   Zags Abroad is a senior design project from 2018-19. The goal is to help students find a study abroad
                   program that fits their interests and fulfills academic requirements more easily!
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What is a core designation? </p>
                  <p className = "faq">
                   Core designations indicate that a course fulfills a specific part of the core curriculum at Gonzaga.
                   Please consult your advisor if you have more questions about core requirements.
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Which class will be listed on my transcript? </p>
                  <p className = "faq">
                    The Gonzaga course title will be listed on your transcript.
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> What does ‘Requires Signature’ mean? </p>
                  <p className = "faq">
                    A "YES" means that you must get a signature from the department chair of the course
                    subject. For example, to get a Biology course approved, you must get a
                    signature from the department chair of Biology.
                    If the department type of the host course is different
                    from that of the Gonzaga course, get the signature from the chair of the Gonzaga course department.
                    Signature forms can be found in the study abroad office.
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Where is Gonzaga in Florence? </p>
                  <p className = "faq">
                    Florence is managed separately from other study abroad programs. You can find information on Florence<span>&nbsp;</span>
                    <a href="https://studyabroad.gonzaga.edu/index.cfm?FuseAction=PublicDocuments.View&File_ID=27240"
                    target = "_blank" rel="noopener noreferrer" style={{color: 'black'}}>here.</a>
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Where are short-term and faculty-led programs? </p>
                  <p className = "faq">
                    Those programs change from semester to semester and usually
                    include slightly different application procedures. We suggest asking
                    your professors or department chairs about these programs.
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Are these all the classes I can take abroad? </p>
                  <p className = "faq">
                    These are the courses that Gonzaga students have gotten credit for in the past.
                    You can take other classes at these universities!
                  </p>
                  <p style={{margin: '0 auto', marginBottom: '5px', fontWeight: 700}}> Are these the only semester-long programs? </p>
                  <p className = "faq">
                    These are all of Gonzaga's sponsored study abroad semester-long programs, but you can work with the study
                    abroad office to get a non-sponsored program approved.
                  </p>
                </div>
              </Dialog>
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
