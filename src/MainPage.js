import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput : '',
      dataSource : ['CPSC', 'BUSI', 'MUSC', 'PHIL', 'MATH','ETC']
    }
  }



  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h1> Welcome! </h1>
            <AutoComplete
              hintText = 'Enter a deparment here (uppercase)'
              dataSource={this.state.dataSource}
              onChange={(value) => this.setState({userInput : value})}
              onUpdateInput={() => console.log(this.state.userInput)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainPage;
