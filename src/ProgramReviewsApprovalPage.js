import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
/*import Switch from '@material-ui/core/Switch';
import { borders } from '@material-ui/system';*/

class ProgramReviewsApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    }
  }

  loadReviews() {
    axios.get("https://zagsabroad-backend.herokuapp.com/surveys").then((res) => {
      console.log(res.data);
    });
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div>
          <p> Hi </p>
        </div>
      );
    } else {
      return (
        <Redirect to="/"/>
      );
    }
  }
}

export default ProgramReviewsApprovalPage;
