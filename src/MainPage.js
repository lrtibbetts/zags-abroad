import React, { Component } from 'react';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import DropdownTextField from './DropdownTextField.js';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [], // Subjects in dropdown Menu
      listOfFilters : [], // Filters applied by the user

      userInput : '',
      courses : [],
      filteredCourses :[],
      programList : [],
      filters: null,
      selectedIndex : 1,
      options : ['Search options:','Department','Gonzaga Course','Location']
    }
    // Backend API
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.setState({courses: res.data});
    });

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

  setFilteredCourses() {
    var counter = 0
    var filteredArray = []
    var filteredPrograms = []
    while (counter < this.state.courses.length) {
      var currentCourse = this.state.courses[counter].gu_course_number.substring(0,4);
      for (var i = 0; i < this.state.listOfFilters.length; i++) {
        if (currentCourse === this.state.listOfFilters[i]) {
          filteredArray = filteredArray.concat(this.state.courses[counter])
          filteredPrograms = filteredPrograms.concat(this.state.courses[counter].host_program)
        }
      }
      if (currentCourse === this.state.userInput) {

      }
      counter++;
    }
    this.setState({filteredCourses: filteredArray})
    this.setState(
      {programList : filteredPrograms},
      () => this.setProgramList()
    )
  }

  setProgramList() {
    var newAr = []
    for (var i = 0; i < this.state.programList.length; i++) {
      if (this.state.programList[i] !== this.state.programList[i + 1]) {
        newAr = newAr.concat(this.state.programList[i])
      }
    }
    this.setState(
      {programList : newAr}
    )
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
    var array = []
    for (var i = 0; i < this.state.listOfFilters.length; i++) {
      if (filter !== this.state.listOfFilters[i]) {
        array.push(this.state.listOfFilters[i]);
      }
    }
    this.setState({listOfFilters : array})
  }

  render() {
    return (
      <div>
        <List component="nav">
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
        </Menu>

        <DropdownTextField
          placeholder = "Enter a department"
          onChange ={ (selectedOption) => {
            let newFilter = selectedOption.value;
            let filters = this.state.listOfFilters;
            filters.push(newFilter);
            this.setState({listOfFilters: filters});
          }}
          options= {this.state.subjects}
        />
        <br/>
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
        </div>
        <h1> Available programs: </h1>
            {this.state.programList.map((program, i) => {
              return(
                <li>
                  {program}
                </li>
              )
            })}
      </div>
    );
  }
}

export default MainPage;
