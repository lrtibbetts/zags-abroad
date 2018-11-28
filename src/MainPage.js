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
      subjects: [], // Subjects in dropdown Menu
      listOfFilters : [], // Filters applied by the user
      programList : [],
      filters: null, // Types of filters
      selectedIndex : 1,
      options : ['Search Options:','Department','Gonzaga Course','Location']
    }

    axios.get("https://zagsabroad-backend.herokuapp.com/subjects").then((res) => {
      let subjectsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let subjectName = res.data[i].subject_name;
        let subjectObj = {value: subjectName, label: subjectName};
        subjectsToAdd.push(subjectObj);
      }
      this.setState({subjects: subjectsToAdd});
    });
  }

  handleClickOnMenu = (event, index) => {
    this.setState({filters : null, selectedIndex : index})
  }

  handleClickOnList = event => {
    this.setState({filters : event.currentTarget,})
  }

  handleClose = () => {
    this.setState({filters : null})
  }

  handleDelete = filter => () => {
    var array = [];
    for (var i = 0; i < this.state.listOfFilters.length; i++) {
      if (filter !== this.state.listOfFilters[i]) {
        array.push(this.state.listOfFilters[i]);
      }
    }
    this.setState({listOfFilters : array},
      () => this.getPrograms()
    );
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
        let course = res.data[i].gu_course_number + " " + res.data[i].gu_course_name;
        courses.push(course);
        i++;
        while(i < res.data.length && res.data[i].host_program === programName) {
          // Add to current courses array
          let newCourse = res.data[i].gu_course_number + " " + res.data[i].gu_course_name;
          courses.push(newCourse);
          if(i < res.data.length) {
            i++;
          }
        }
        let programObj = {programName: programName, courses: courses};
        programsToAdd.push(programObj);
      }
      console.log(programsToAdd);
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
          filters={this.state.filters}
          open={Boolean(this.state.filters)}
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
            onChange ={ (selectedOption) => {
              let newFilter = selectedOption.value;
              let filters = this.state.listOfFilters;
              filters.push(newFilter);
              this.setState({listOfFilters: filters});
              this.getPrograms();
            }}
            options= {this.state.subjects}
          />
        </div><br/>
        <div>
          {this.state.listOfFilters.map(filter => {
            return (
              <Chip
                key={filter}
                onDelete={this.handleDelete(filter)}
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
