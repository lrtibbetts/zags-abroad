import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import './ProgramReviewsApprovalPage.css';

class ProgramReviewsApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    }
    this.loadReviews();
  }

  loadReviews() {
    axios.get("https://zagsabroad-backend.herokuapp.com/surveys").then((res) => {
      let reviewsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let review = res.data[i];
        let id = review.ID;
        axios.post("https://zagsabroad-backend.herokuapp.com/surveyphotos", {survey_id: id}).then((res) => {
          review['photos'] = res.data;
          reviewsToAdd.push(review);
          this.setState({reviews: reviewsToAdd});
        });
      }
    });
  }

  render() {
    const cookies = this.props.cookies;
    console.log(this.state.reviews);
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', margin: '5%'}}>
          {this.state.reviews.map((review, index) => {
            return (
              <div key={index}>
                <Paper>
                  <p> <b>Name:</b> {review.name} &nbsp;&nbsp; <b>Email:</b> {review.email}</p>
                  <p> <b>Major:</b> {review.major} &nbsp;&nbsp; <b>Year:</b> {review.year}</p>
                  <p> <b>Program :</b> {review.program} &nbsp;&nbsp; <b>Term:</b> {review.term}, {review.calendar_year}</p>
                </Paper><br/>
              </div>
            );
          })}
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
