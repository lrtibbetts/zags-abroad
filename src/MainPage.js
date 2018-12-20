import React, { Component } from 'react';
import axios from 'axios';
/*import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';*/
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import DropdownTextField from './DropdownTextField.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const listItemStyle = {
  textAlign: 'left'
}

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
      programList : [],
      typesOfFilters: null, // Types of filters, e.g. department
      selectedIndex : 1,
      options : ['Search Options:','Department','Gonzaga Course','Location']
    }

    axios.get("https://zagsabroad-backend.herokuapp.com/subjects").then((res) => {
      let subjectsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let subjectName = res.data[i].subject_name.trim();
        let subjectObj = {value: subjectName, label: subjectName};
        subjectsToAdd.push(subjectObj);
      }
      this.setState({subjects: subjectsToAdd});
    });
  }

  handleClickOnMenu = (event, index) => {
    this.setState({typesOfFilters : null, selectedIndex : index})
  }

  handleClickOnList = event => {
    this.setState({typesOfFilters : event.currentTarget})
  }

  handleClose = () => {
    this.setState({typesOfFilters : null})
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
        let subjects = this.state.subjects;
        subjects.splice(i, 1);
        this.setState({subjects: subjects});
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
        let course = res.data[i].gu_course_number + " " + res.data[i].gu_course_name
        + " - " + res.data[i].host_course_name;
        courses.push(course);
        i++;
        while(i < res.data.length && res.data[i].host_program === programName) {
          // Add to current courses array
          let newCourse = res.data[i].gu_course_number + " " + res.data[i].gu_course_name
          + " - " + res.data[i].host_course_name;
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
        {/*<List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Search By:"
            onClick={this.handleClickOnList}
            >
            <ListItemText
              primary="Search by:"
              secondary={this.state.options[this.state.selectedIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          typesOfFilters={this.state.typesOfFilters}
          open={Boolean(this.state.typesOfFilters)}
          onClose={this.handleClose}
          >
          {this.state.options.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleClickOnMenu(event, index)}
              >
              {option}
              </MenuItem>
          ))}
        </Menu>*/}
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
                    {program.courses.map((course, index) => {
                      return (
                        <li key={index} style={listItemStyle}> {course} </li>
                      );
                    })}
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
