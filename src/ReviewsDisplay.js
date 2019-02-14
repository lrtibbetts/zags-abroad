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
      surveys: [{"residences": []},
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

    axios.post("https://zagsabroad-backend.herokuapp.com/programsurveys", {"program": this.props.name}).then((res) => {
      let surveysToAdd = [];

/*      let residencesToAdd = [];
      let tripsToAdd = [];
      let classesToAdd = [];
      let activitiesToAdd = [];
      let staffToAdd = [];
      let otherToAdd = [];
*/
      for(let i = 0; i < res.data.length; i++) {
         /*let major = res.data[i].major.trim();
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
         let other = ((res.data[i].other) ? res.data[i].other.trim() : "");*/
/*
         let majorObj = {value: major, label: major};
         let emailObj = {value: email, label: email};
         let nameObj = {value: name, label: name};
         let programObj = {value: program, label: program};
         let termObj = {value: term, label: term};
         let yearObj = {value: year, label: year};
         let residenceObj = {value: residence, label: residence};
         let tripsObj = {value: trips, label: trips};
         let classesObj = {value: classes, label: classes};
         let activitiesObj = {value: activities, label: activities};
         let staffObj = {value: staff, label: staff};
         let otherObj = {value: other, label: other};
*/
        surveysToAdd.push(res.data[i]);
/*
        residencesToAdd.push(residenceObj);
        tripsToAdd.push(tripsObj);
        classesToAdd.push(classesObj);
        activitiesToAdd.push(activitiesObj);
        staffToAdd.push(staffObj);
        otherToAdd.push(otherObj);
*/
      }
      //this.setState({surveys: surveysToAdd});
      this.setState({surveys: [{residences: ["r","k"]}, {trips: ["r","k"]}, {classes: ["r","k"]}, {activities: ["r","k"]}, {staff: ["r","k"]}, {other: ["r","k"]}]})
      this.setState({residences: ["gl","ads"]});
      this.setState({trips: ["there were lots of fun trips", "london, paris, maybe tokyo"]});
      this.setState({classes: ["hard","eh"]});
      this.setState({activities: ["volleyball","nafma"]});
      this.setState({staff: ["they were ok","nice but hard"]});
      this.setState({other: ["a;dlskfj","adasdfs"]});
      console.log(this.state.surveys);
      console.log(this.state.residences);
      console.log(this.state.surveys.residences);
    });
  }

  handleTabChange = (event, value) => {
    this.setState({tabValue: value});
  };



  render() {
    const { tabValue } = this.state;
    let residences;
    let len = this.state.surveys.residences;
    if (len) {
      residences = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.residences}</ul>
           {
            surv.residences.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
    } else {
      residences = "No residence reviews at this time!";
    }

    let trips;
    len = this.state.surveys.trips;
    if (len) {
      trips = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.trips}</ul>
           {
            surv.trips.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
    } else {
      trips = "No trip reviews at this time!";
    }

    let classes;
    len = this.state.surveys.classes;
    if (len) {
      classes = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.classes}</ul>
           {
            surv.classes.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
    } else {
      classes = "No class reviews at this time!";
    }

    let activities;
    len = this.state.surveys.activities;
    if (len) {
      activities = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.activities}</ul>
           {
            surv.activities.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
    } else {
      activities = "No activities reviews at this time!";
    }

    let staff;
    len = this.state.surveys.staff;
    if (len) {
      staff = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.staff}</ul>
           {
            surv.staff.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
    } else {
      staff = "No staff reviews at this time!";
    }

    let other;
    len = this.state.surveys.other;
    if (len) {
      other = len.map((surv) => {
        return (
          <div key={surv}>
            <ul >{surv.other}</ul>
           {
            surv.other.map((subitem) => {
              return (<li key={subitem}>{subitem}</li>)
            })
           }
          </div>
        )
       })
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
        {tabValue === 0 && <TabContainer>{<div>{residences}</div>}</TabContainer>}
        {tabValue === 1 && <TabContainer>{<div>{trips}</div>}</TabContainer>}
        {tabValue === 2 && <TabContainer>{<div>{classes}</div>}</TabContainer>}
        {tabValue === 3 && <TabContainer>{<div>{activities}</div>}</TabContainer>}
        {tabValue === 4 && <TabContainer>{<div>{staff}</div>}</TabContainer>}
        {tabValue === 5 && <TabContainer>{<div>{other}</div>}</TabContainer>}
      </div>
    );
  }
}

export default ReviewsDisplay;
