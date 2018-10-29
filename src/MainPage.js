import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavigationBar from './NavigationBar.js';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn : false,
      isAdmin : false
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1>Zags Abroad</h1>
            <NavigationBar isLoggedIn = {this.state.isLoggedIn} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainPage;
