import axios from 'axios';
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import "./ReviewsDisplay.css";

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

  render() {
    const { tabValue } = this.state;
    return (
      <div style={{marginLeft: '2vw', marginRight: '2vw', marginTop: '20px'}}>
        <AppBar position ="static" color="primary">
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
            variant="fullWidth">
            <Tab label="Residence"/>
            <Tab label="Trips"/>
            <Tab label="Classes"/>
            <Tab label="Activities"/>
            <Tab label="Staff"/>
          </Tabs>
        </AppBar>
        {tabValue === 0 &&
          <div>
            <h4> Where did you stay while abroad? What was it like? </h4>
            {this.state.surveys.map((residenceSurvey, index) =>
            {if (residenceSurvey.residence !== "") {
              return(
                <div key={index}>
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
              );
            } else { return null }})}
          </div>}
        {tabValue === 1 &&
          <div>
            <h4> Tell us about any favorite trips you took while abroad. </h4>
            {this.state.surveys.map((tripSurvey, index) =>
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
              );
            } else { return null }})}
          </div>}
        {tabValue === 2 &&
          <div>
            <h4> What were your classes like? </h4>
            {this.state.surveys.map((classSurvey, index) =>
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
              );
            } else { return null }})}
          </div>}
        {tabValue === 3 &&
          <div>
            <h4> Tell us about any extracurricular activities you participated in. </h4>
            {this.state.surveys.map((activitySurvey, index) =>
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
              );
            } else { return null }})}
          </div>}
        {tabValue === 4 &&
          <div>
            <h4> What were your experiences with on-campus staff and facilities? </h4>
            {this.state.surveys.map((staffSurvey, index) =>
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
            } else { return null }})}
          </div>}
      </div>
    );
  }
}

export default ReviewsDisplay;
