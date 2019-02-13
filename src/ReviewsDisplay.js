import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import SwipeableViews from 'react-swipeable-views';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';

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

    axios.post("https://zagsabroad-backend.herokuapp.com/programsurveys", {"program": this.props.name}).then((res) => {
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
      console.log(this.state.surveys);
    });
  }

  TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

  handleTabChange = (event, value) => {
    this.setState({tabValue: value});
  };

  handleTabChangeIndex = index => {
    this.setState({tabValue: index});
  };

  render() {
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
          <SwipeableViews>
            <TabContainer>
              <List>
                <ListItem>
                  <ListItemText primary="Kristen" secondary="Welcome to this program" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Kristen" secondary="Welcome to this program" />
                </ListItem>
              </List>
            </TabContainer>
          </SwipeableViews>
        </AppBar>
      </div>
    );
  }
}

export default ReviewsDisplay;
