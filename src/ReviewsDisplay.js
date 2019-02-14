import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';



function TabContainer(props) {
return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}


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
      surveys: [
      {residences: []},
      {trips: []},
      {classes: []},
      {activities: []},
      {staff: []},
      {other: []}],
      residences: [],
      trips: [],
      classes: [],
      activities: [],
      staff: [],
      other: [],
      tabValue: 0
    }

    axios.post("https://zagsabroad-backend.herokuapp.com/programsurveys", {"program": this.props.program}).then((res) => {
      console.log(res.data);
      let surveysToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
         let major = res.data[i].major.trim();
         let email = ((res.data[i].email) ? res.data[i].email.trim() : "");
         let name = ((res.data[i].name) ? res.data[i].name.trim() : "");
         let program = res.data[i].program.trim();
         let term = res.data[i].term.trim();
         let year = res.data[i].year.trim();
         let residence = ((res.data[i].residence) ? res.data[i].residence.trim() : "");
         let trips = ((res.data[i].trips) ? res.data[i].trips.trim() : "");
         let classes = ((res.data[i].classes) ? res.data[i].classes.trim() : "");
         let activities = ((res.data[i].activities) ? res.data[i].activities.trim() : "");
         let staff = ((res.data[i].staff) ? res.data[i].staff.trim() : "");
         let other = ((res.data[i].other) ? res.data[i].other.trim() : "");
        surveysToAdd.push(res.data[i]);
      }
      this.setState({surveys: surveysToAdd});
    });
  }

  handleTabChange = (event, value) => {
    this.setState({tabValue: value});
  };



  render() {
    const { tabValue } = this.state;
    let residences;
    let len = this.state.surveys.filter(item => item.residence)
    if (len) {
      residences = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          residences.push(this.state.surveys[i].residence);
        }
      }
    } else {
      residences = "No residence reviews at this time!";
    }

    let trips;
    len = this.state.surveys.filter(item => item.trips)
    if (len) {
      trips = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          trips.push(this.state.surveys[i].trips);
        }
      }
    } else {
      trips = "No trip reviews at this time!";
    }

    let classes;
    len = this.state.surveys.filter(item => item.classes)
    if (len) {
      classes = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          classes.push(this.state.surveys[i].classes);
        }
      }
    } else {
      classes = "No class reviews at this time!";
    }

    let activities;
    len = this.state.surveys.filter(item => item.activities)
    if (len) {
      activities = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          activities.push(this.state.surveys[i].activities);
        }
      }
    } else {
      activities = "No activity reviews at this time!";
    }

    let staff;
    len = this.state.surveys.filter(item => item.staff)
    if (len) {
      staff = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          staff.push(this.state.surveys[i].staff);
        }
      }
    } else {
      staff = "No staff reviews at this time!";
    }

    let other;
    len = this.state.surveys.filter(item => item.other)
    if (len) {
      other = [];
      for (var i = 0; i < 200; i++){
        if (this.state.surveys[i] && this.state.surveys[i] !== ""){
          other.push(this.state.surveys[i].other);
        }
      }
    } else {
      other = "No other reviews at this time!";
    }



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
          {tabValue === 0 && <TabContainer>{<div>{
            <div>
              {residences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}

          {tabValue === 1 && <TabContainer>{<div>{
            <div>
              {trips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}

          {tabValue === 2 && <TabContainer>{<div>{
            <div>
              {classes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}

          {tabValue === 3 && <TabContainer>{<div>{
            <div>
              {activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}

          {tabValue === 4 && <TabContainer>{<div>{
            <div>
              {staff.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}

          {tabValue === 5 && <TabContainer>{<div>{
            <div>
              {other.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </div>
          }</div>}</TabContainer>}
      </div>
    );
  }
}

export default ReviewsDisplay;
