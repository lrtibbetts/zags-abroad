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
    return profileStr;
  }

  handleTabChange = (event, value) => {
    this.setState({tabValue: value});
  };

/*
{tabValue === 5 &&
this.state.surveys.map((otherSurvey, index) =>
{if (otherSurvey.other !== "") {
  return(
    <div className="other" key={index}>
    {this.surveyProfile(otherSurvey)}
    <List
      subheader={
        <div>
          {this.profileStr}
          {otherSurvey.major}<br/>
          {otherSurvey.term + " " + otherSurvey.calendar_year}
        </div>
      }>
      <ListItem><ListItemText secondary={otherSurvey.other}/></ListItem>
    </List>
    </div>
  )
}})}
*/

//EDIT FORMAT HERE
// https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function

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
          </Tabs>
        </AppBar>
        {tabValue === 0 &&
          this.state.surveys.map((residenceSurvey, index) =>
          {if (residenceSurvey.residence !== "") {
            return(
              <div className="residence" key={index}>
              {this.surveyProfile(residenceSurvey)}
              <List
                subheader={
                  <div>
                    {this.profileStr}
                    {residenceSurvey.major}<br/>
                    {residenceSurvey.term + " " + residenceSurvey.calendar_year}
                  </div>
                }>
                <ListItem><ListItemText secondary={residenceSurvey.residence}/></ListItem>
              </List>
              </div>
            )
          }})}
        {tabValue === 1 &&
          this.state.surveys.map((tripSurvey, index) =>
          {if (tripSurvey.trips !== "") {
            return(
              <div className="trips" key={index}>
              {this.surveyProfile(tripSurvey)}
              <List
                subheader={
                  <div>
                    {this.profileStr}
                    {tripSurvey.major}<br/>
                    {tripSurvey.term + " " + tripSurvey.calendar_year}
                  </div>
                }>
                <ListItem><ListItemText secondary={tripSurvey.trips}/></ListItem>
              </List>
              </div>
            )
          }})}
        {tabValue === 2 &&
          this.state.surveys.map((classSurvey, index) =>
          {if (classSurvey.classes !== "") {
            return(
              <div className="classes" key={index}>
              {this.surveyProfile(classSurvey)}
              <List
                subheader={
                  <div>
                    {this.profileStr}
                    {classSurvey.major}<br/>
                    {classSurvey.term + " " + classSurvey.calendar_year}
                  </div>
                }>
                <ListItem><ListItemText secondary={classSurvey.classes}/></ListItem>
              </List>
              </div>
            )
          }})}
        {tabValue === 3 &&
          this.state.surveys.map((activitySurvey, index) =>
          {if (activitySurvey.activities !== "") {
            return(
              <div className="activities" key={index}>
              {this.surveyProfile(activitySurvey)}
              <List
                subheader={
                  <div>
                    {this.profileStr}
                    {activitySurvey.major}<br/>
                    {activitySurvey.term + " " + activitySurvey.calendar_year}
                  </div>
                }>
                <ListItem><ListItemText secondary={activitySurvey.activities}/></ListItem>
              </List>
              </div>
            )
          }})}
        {tabValue === 4 &&
          this.state.surveys.map((staffSurvey, index) =>
          {if (staffSurvey.staff !== "") {
            return(
              <div className="staff" key={index}>
              {this.surveyProfile(staffSurvey)}
              <List
                subheader={
                  <div>
                    {this.profileStr}
                    {staffSurvey.major}<br/>
                    {staffSurvey.term + " " + staffSurvey.calendar_year}
                  </div>
                }>
                <ListItem><ListItemText secondary={staffSurvey.staff}/></ListItem>
              </List>
              </div>
            )
          }})}
      </div>
    );
  }
}

export default ReviewsDisplay;
