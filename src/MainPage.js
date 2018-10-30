import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class MainPage extends Component {

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1>Zags Abroad</h1>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainPage;
