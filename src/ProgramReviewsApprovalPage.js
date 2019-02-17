import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './ProgramReviewsApprovalPage.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

var _ = require('lodash'); // Provides the neat 'omit' function

class ProgramReviewsApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      loading: true,
      submitting: false,
      showMessage: false,
      message: ''
    }
    this.displayMessage = this.displayMessage.bind(this);
    this.loadReviews();
  }

  displayMessage(message) {
    this.setState({
      showMessage: true,
      message: message
    })
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
          if(res.data[i].url !== null) {
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
          }
          i++;
        }
        review['photos'] = photos;
        review = _.omit(review, ['url', 'width', 'height', 'survey_id']);
        reviewsToAdd.push(review);
      }
      this.setState({submitting: false, reviews: reviewsToAdd, loading: false});
      console.log(reviewsToAdd);
    });
  }

  savePhotos(photos) {
    if(photos.length === 0) {
      this.loadReviews();
      return;
    }

    for(let j = 0; j < photos.length; j++) {
      if(photos[j].approved) {
        axios.post("https://zagsabroad-backend.herokuapp.com/approvephoto", {"url": photos[j].url}).then((res) => {
          this.loadReviews();
          this.displayMessage("Photos have been approved!")
        });
      } else {
        axios.post("https://zagsabroad-backend.herokuapp.com/deletephoto", {"url": photos[j].url}).then((res) => {
          this.loadReviews();
          this.displayMessage("Photos have been rejected!")
        });
      }
    }
  }

  saveChanges(review) {
    if(review.approved) {
      axios.post("https://zagsabroad-backend.herokuapp.com/approvesurvey", {"id": review.ID}).then((res) => {
        this.savePhotos(review.photos);
      });
    } else {
      axios.post("https://zagsabroad-backend.herokuapp.com/deletesurvey", {"id": review.ID}).then((res) => {
        this.savePhotos(review.photos);
      });
    }
  }

  render() {
    console.log("BRUUUHHH" + this.state.reviews);
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', marginLeft: '5%', marginRight: '5%'}}>
          {this.state.reviews.map((review) => {
            return (
              <div className="reviews" key={review.ID}>
                <Paper>
                  <div style={{textAlign: 'left', marginLeft: '10px'}}>
                    <FormControlLabel
                      control={<Switch color="primary"> </Switch>}
                      label="Approve text"
                      onChange={(event) => {
                        if(event.target.checked) {
                          review['approved'] = true;
                        } else {
                          review['approved'] = false;
                        }
                      }}>
                    </FormControlLabel>
                  </div>
                  <p> <b>Name:</b> {review.name} &nbsp;&nbsp; <b>Email:</b> {review.email}</p>
                  <p> <b>Major:</b> {review.major} &nbsp;&nbsp; <b>Year:</b> {review.year}</p>
                  <p> <b>Program :</b> {review.program} &nbsp;&nbsp; <b>Term:</b> {review.term}, {review.calendar_year}</p>
                  <p> <b>Residence:</b> {review.residence}</p>
                  <p> <b>Trips:</b> {review.trips}</p>
                  <p> <b>Classes:</b> {review.classes}</p>
                  <p> <b>Activities:</b> {review.activities}</p>
                  <p> <b>Staff:</b> {review.staff}</p>
                  <p> <b>Other:</b> {review.other}</p>
                  {review.photos.length > 0 ? <h3> Photos: </h3> : null}
                  {review.photos.map((photo) =>
                    <div className="photo" key={photo.url}>
                      <FormControlLabel
                        control={<Switch color="primary"></Switch>}
                        label="Approve"
                        onChange={(event) => {
                          if(event.target.checked) {
                            photo['approved'] = true;
                          } else {
                            photo['approved'] = false;
                          }
                        }}>
                      </FormControlLabel> <br/>
                      <img src={photo.url} width={photo.width} height={photo.height} alt=""></img>
                    </div>
                  )}<br/>
                  <div style={{paddingBottom: '15px'}}>
                    <Button variant="contained"
                      onClick = {(event) => {
                        this.setState({open: true})
                        this.saveChanges(review)
                      }}>
                      Save </Button>
                  </div>
                </Paper><br/>
              </div>
            );
          })}
          {(this.state.reviews.length === 0 && !this.state.loading) ? <p> No reviews to approve at this time! </p> : null}
          {this.state.submitting ?
            <Snackbar
              message="Successfully saved changes!"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={this.state.open}
              autoHideDuration={4000}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={(event) => this.setState({open: false})}
                >
                  <CloseIcon />
                </IconButton>,
              ]}
              onClose={(event) => this.setState({ open: false })}
            >
            </Snackbar>
             : null}
          {this.state.loading ? <CircularProgress variant="indeterminate"/> : null}
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
