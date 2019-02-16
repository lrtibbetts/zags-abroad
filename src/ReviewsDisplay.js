import axios from 'axios';
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ReviewsDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyColumns: [
        { name: "Name",
          options: { display: false } },
        { name: "Major" },
        { name: "Year" },
        { name: "Classes" },
      ],
      surveys: [],
      tabValue: 0
    }

    axios.post("https://zagsabroad-backend.herokuapp.com/programsurveys", {"program": this.props.program}).then((res) => {
      let surveysToAdd = res.data;
      this.setState({surveys: surveysToAdd});
      console.log(this.state.surveys)
    });
  }

  // Create profile using name, major, term and year of user who submitted survey
  surveyProfile(survey) {
    let profileStr = (survey.name === "") ? "Anonymous" : survey.name;
    profileStr += "\n" + survey.major + ", " + survey.major;
    profileStr += "\n" + survey.term + survey.calendar_year;
    return profileStr;
  }

  handleTabChange = (event, value) => {
    this.setState({tabValue: value});
  };

  render() {
    const { tabValue } = this.state;
    return (
      <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '20px'}}>
        <AppBar position ="static" color="default">
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth">
            <Tab label="Residence"/>
            <Tab label="Trips"/>
            <Tab label="Classes"/>
            <Tab label="Activities"/>
            <Tab label="Staff"/>
            <Tab label="Other"/>
          </Tabs>
        </AppBar>
        {tabValue === 0 &&
          this.state.surveys.map((residenceSurvey, index) => {
            return(
              <div className="residence" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={residenceSurvey.name} secondary={residenceSurvey.residence} />
                </ListItem>
              </List>
              </div>
            )
          })} 
        {tabValue === 1 &&
          this.state.surveys.map((tripSurvey, index) => {
            return(
              <div className="trips" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={tripSurvey.name} secondary={tripSurvey.trips} />
                </ListItem>
              </List>
              </div>
            )
          })}
        {tabValue === 2 &&
          this.state.surveys.map((classSurvey, index) => {
            return(
              <div className="classes" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={classSurvey.name} secondary={classSurvey.classes} />
                </ListItem>
              </List>
              </div>
            )
          })}
        {tabValue === 3 &&
          this.state.surveys.map((activitySurvey, index) => {
            return(
              <div className="activities" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={activitySurvey.name} secondary={activitySurvey.activities} />
                </ListItem>
              </List>
              </div>
            )
          })}
        {tabValue === 4 &&
          this.state.surveys.map((staffSurvey, index) => {
            return(
              <div className="staff" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={staffSurvey.name} secondary={staffSurvey.staff} />
                </ListItem>
              </List>
              </div>
            )
          })}
        {tabValue === 5 &&
          this.state.surveys.map((otherSurvey, index) => {
            return(
              <div className="other" key={index}>
              <List>
                <ListItem>
                  <ListItemText primary={otherSurvey.name} secondary={otherSurvey.other} />
                </ListItem>
              </List>
              </div>
            )
          })}
      </div>
    );
  }
}

export default ReviewsDisplay;
