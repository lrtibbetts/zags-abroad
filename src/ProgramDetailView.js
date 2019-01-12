import React, { Component } from 'react';

class ProgramDetailView extends Component {
  render() {
    return(
      <div style={{textAlign: 'center'}}>
        <h1>{this.props.name}</h1>
      </div>
    );
  }
}

export default ProgramDetailView;
