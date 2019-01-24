import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CourseEquivalencyPage from './CourseEquivalencyPage.js'

//this function allows us to manipulate the spacing of the
//tab bar
function TabContainer(props) {
  return (
    <Typography component="div" style={{padding: 8*3}}>
      {props.children}
    </Typography>
  );
}

TabContainer.PropTypes = {
  children: PropTypes.node.isRequired,
};

//this is the styling for the tab view
const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});


class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }

  }

  handleChange = (event, value) => {
    this.setState({value});
  }

  render() {
    const {value} = this.state;
      return (
        <div style={{textAlign: 'center'}}>
          <AppBar position="static">
            <Tabs value={value} centered onChange={this.handleChange}>
              <Tab label="Course Equivalencies" />
              <Tab label="Survey Approvals" />
              <Tab label="Other" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><h1> Course Equivalencies </h1>
            <CourseEquivalencyPage cookies = {this.props.cookies}/>
          </TabContainer>}
          {value === 1 && <TabContainer>
              <h1>Survey Approvals</h1>
            </TabContainer>}
          {value === 2 && <TabContainer><h1>Honestly, I forget what is supposed to be here... but welcome</h1></TabContainer>}

        </div>
      )

  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminPage);
