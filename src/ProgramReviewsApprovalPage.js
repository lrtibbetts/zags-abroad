import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import './ProgramReviewsApprovalPage.css';

var _ = require('lodash'); // Provides the neat 'omit' function

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
      let i = 0;
      while(i < res.data.length) {
        let review = res.data[i];
        let photos = [];
        photos.push({url: review.url, width: review.width, height: review.height});
        review['photos'] = photos;
        review = _.omit(review, ['url', 'width', 'height', 'survey_id'])
        let id = review.ID;
        i++;
        while(i < res.data.length && res.data[i].ID === id) {
          photos.push({url: res.data[i].url, width: res.data[i].width, height: res.data[i].height});
          i++;
        }
        reviewsToAdd.push(review);
      }
      this.setState({reviews: reviewsToAdd});
    });
  }

  render() {
    const cookies = this.props.cookies;
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
