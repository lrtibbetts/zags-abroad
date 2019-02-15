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
        let id = review.ID;
        while(i < res.data.length && res.data[i].ID === id) {
          // Add any corresponding photos to review object
          let width = res.data[i].width;
          let height = res.data[i].height;
          if (width > height && width > 400) {
            // Landscape image: calculate scaled width and height
            let scaledHeight = (height / width) * 400;
            photos.push({url: res.data[i].url, height: scaledHeight, width: 400});
          } else if (height > width && height > 350) {
            // Portrait image: calculate scaled width and height
            let scaledWidth = (width / height) * 350;
            photos.push({url: res.data[i].url, height: 350, width: scaledWidth});
          } else {
            photos.push({url: res.data[i].url, height: res.data[i].height, width: res.data[i].width});
          }
          i++;
        }
        review['photos'] = photos;
        review = _.omit(review, ['url', 'width', 'height', 'survey_id'])
        reviewsToAdd.push(review);
      }
      this.setState({reviews: reviewsToAdd});
    });
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', marginLeft: '5%', marginRight: '5%'}}>
          {this.state.reviews.map((review, index) => {
            return (
              <div key={index}>
                <Paper>
                  <p> <b>Name:</b> {review.name} &nbsp;&nbsp; <b>Email:</b> {review.email}</p>
                  <p> <b>Major:</b> {review.major} &nbsp;&nbsp; <b>Year:</b> {review.year}</p>
                  <p> <b>Program :</b> {review.program} &nbsp;&nbsp; <b>Term:</b> {review.term}, {review.calendar_year}</p>
                  <p> <b>Residence:</b> {review.residence}</p>
                  <p> <b>Trips:</b> {review.trips}</p>
                  <p> <b>Classes:</b> {review.classes}</p>
                  <p> <b>Activities:</b> {review.activities}</p>
                  <p> <b>Staff:</b> {review.staff}</p>
                  <p> <b>Other:</b> {review.other}</p>
                  {review.photos.map(photo =>
                    <img src={photo.url} width={photo.width} height={photo.height}></img>
                  )}
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
