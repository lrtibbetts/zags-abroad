import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";



class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput : '',
      dataSource : ['CPSC', 'BUSI', 'MUSC', 'PHIL', 'MATH','ETC'],
      courses : [],
      filteredCourses :[],
      newArray : [],
      programList : [],
      filters : null,
      selectedIndex : 1,
      options : ['Search options:','Course Deparment','Language','Location'],
      listOfFilters : []
    }
    //backend API
    axios.get("https://zagsabroad-backend.herokuapp.com/courses").then((res) => {
      this.setState({courses: res.data});
    });
  }

  setFilteredCourses(counter, currentC, array) {
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
    this.setState({
      filters : event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({filters : null})
  }

  setFilters() {
    var arr = this.state.listOfFilters
    arr = arr.concat(this.state.userInput)
    this.setState({listOfFilters : arr})
  }

  handleDelete = (filter) => {
    var array = []
    for (var i = 0; i < this.state.listOfFilters.length; i++) {
      if (filter !== this.state.listOfFilters[i]) {
        array = array.concat(this.state.listOfFilters[i])
      }
    }
    this.setState({listOfFilters : array})
}


  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1> Welcome to the main program search page! </h1>
            <List component="nav">
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label="Search By:"
                onClick={this.handleClickOnList}
                >
                <ListItemText
                  primary="Search By:"
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


            <AutoComplete
              hintText = 'Enter a deparment here (uppercase)'
              dataSource={this.state.dataSource}
              onMouseOut ={ (event, value) => this.setState({userInput : event.currentTarget.value},
                () => this.setFilteredCourses(0, [], [])
              )}
            />

            <Button color="primary" onClick ={this.setFilters.bind(this)}>
              Add Filter
            </Button>


            <Paper>
              {this.state.listOfFilters.map(data => {
                let icon = null;
                return (
                  <Chip
                    icon={icon}
                    label={data}
                  />
                );
              })}
            </Paper>

            <h1> Search Results: </h1>
                {this.state.programList.map((program, i) => {
                  return(
                    <li>
                      The program {program} is offered with this criteria.
                    </li>
                  )
                })}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainPage;
