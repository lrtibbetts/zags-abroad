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
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

var _ = require('lodash'); // Provides the neat 'omit' function

class ProgramReviewsApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      extraPhotos: [], // Photos without reviews
      showUnapproved: true, // Only show unapproved reviews by default
      showApproved: false,
      loading: true,
      submitting: false,
      showMessage: false,
      message: ''
    }
    this.displayMessage = this.displayMessage.bind(this);
    this.loadReviews = this.loadReviews.bind(this);
    this.loadReviews();
  }

  displayMessage(message) {
    this.setState({showMessage: true, message: message});
  }

  formatReviews(data) {
    let reviewsToAdd = [];
    let extraPhotos = [];
    let i = 0;
    while(i < data.length) {
      let review = data[i];
      let id = review.ID;
      if (id === null) {
        // Previously pproved photo without review
        let width = data[i].width;
        let height = data[i].height;
        if (width > height && width > 400) {
          // Landscape image: calculate scaled width and height
          let scaledHeight = (height / width) * 400;
          extraPhotos.push({url: data[i].url, height: scaledHeight, width: 400, approved: 1});
        } else if (height > width && height > 350) {
          // Portrait image: calculate scaled width and height
          let scaledWidth = (width / height) * 350;
          extraPhotos.push({url: data[i].url, height: 350, width: scaledWidth, approved: 1});
        } else {
          extraPhotos.push({url: data[i].url, height: data[i].height, width: data[i].width, approved: 1});
        }
        i++;
      } else {
        let photos = [];
        while(i < data.length && data[i].ID === id) {
          // Add any corresponding photos to review object
          if(data[i].url !== null) {
            let width = data[i].width;
            let height = data[i].height;
            if (width > height && width > 400) {
              // Landscape image: calculate scaled width and height
              let scaledHeight = (height / width) * 400;
              photos.push({url: data[i].url, height: scaledHeight, width: 400, approved: data[i].approved});
            } else if (height > width && height > 350) {
              // Portrait image: calculate scaled width and height
              let scaledWidth = (width / height) * 350;
              photos.push({url: data[i].url, height: 350, width: scaledWidth, approved: data[i].approved});
            } else {
              photos.push({url: data[i].url, height: data[i].height, width: data[i].width, approved: data[i].approved});
            }
          }
          i++;
        }
        review['photos'] = photos;
        review = _.omit(review, ['url', 'width', 'height', 'survey_id']);
        reviewsToAdd.push(review);
      }
    }
    console.log(extraPhotos);
    this.setState({submitting: false, reviews: reviewsToAdd, extraPhotos: extraPhotos, loading: false});
  }

  loadReviews() {
    if(this.state.submitting) {
      this.displayMessage("Changes have been saved!");
    }
    if(this.state.showUnapproved === true && this.state.showApproved === true) {
      // Show all reviews
      axios.get("https://zagsabroad-backend.herokuapp.com/surveys").then((res) => {
        console.log(res.data);
        this.formatReviews(res.data);
      });
    } else if(this.state.showApproved === true) {
      axios.get("https://zagsabroad-backend.herokuapp.com/approvedsurveys").then((res) => {
        this.formatReviews(res.data);
      });
    } else if(this.state.showUnapproved === true){
      axios.get("https://zagsabroad-backend.herokuapp.com/unapprovedsurveys").then((res) => {
        this.formatReviews(res.data);
      });
    } else {
      this.setState({reviews: []})
    }
  }

  savePhotos(photos) {
    if(photos.length === 0) {
      this.loadReviews();
      return;
    }

    for(let j = 0; j < photos.length; j++) {
      if(photos[j].approved) {
        axios.post("https://zagsabroad-backend.herokuapp.com/approvephoto", {"url": photos[j].url}).then((res) => {
          if(j === photos.length - 1) {
            // Reload reviews after last photo is approved
            this.loadReviews();
          }
        });
      } else {
        axios.post("https://zagsabroad-backend.herokuapp.com/deletephoto", {"url": photos[j].url}).then((res) => {
          if(j === photos.length - 1) {
            // Reload reviews after last photo is deleted
            this.loadReviews();
          }
        });
      }
    }
  }

  saveChanges(review) {
    this.setState({submitting: true, loading: true, reviews: []});
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
    console.log(this.state.extraPhotos);
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', marginLeft: '5%', marginRight: '5%'}}>
          <div>
            <FormGroup row>
              <p> View: &nbsp; </p>
              <FormControlLabel
                control={
                <Checkbox
                  checked={this.state.showUnapproved}
                  onChange={(event) => {
                    this.setState({showUnapproved: event.target.checked}, () => this.loadReviews());
                  }}
                />}
                label="Unapproved"
              />
              <FormControlLabel
                control={
                <Checkbox
                  checked={this.state.showApproved}
                  onChange={(event) =>  {
                    this.setState({showApproved: event.target.checked}, () => this.loadReviews());
                  }}
                />}
                label="Approved"
              />
            </FormGroup>
          </div>
          {this.state.reviews.map((review) => {
            return (
              <div className="reviews" key={review.ID}>
                <Paper>
                  <div style={{textAlign: 'left', marginLeft: '10px'}}>
                    <FormControlLabel
                      control={<Switch color="primary" checked={Boolean(review.approved)}> </Switch>}
                      label="Approve text"
                      onChange={(event) => {
                        if(event.target.checked) {
                          review.approved = true;
                          this.forceUpdate();
                        } else {
                          review.approved = false;
                          this.forceUpdate();
                        }
                      }}>
                    </FormControlLabel>
                  </div>
                  <p style= {{textAlign: 'right', marginRight: '10px'}}> <i> Submitted: </i> {review.timestamp}</p>
                  <p> <b>Name:</b> {review.name} &nbsp;&nbsp; <b>Email:</b> {review.email}</p>
                  <p> <b>Major:</b> {review.major} &nbsp;&nbsp; <b>Year:</b> {review.year}</p>
                  <p> <b>Program:</b> {review.program} &nbsp;&nbsp; <b>Term:</b> {review.term}, {review.calendar_year}</p>
                  <p> <b>Residence:</b> {review.residence}</p>
                  <p> <b>Trips:</b> {review.trips}</p>
                  <p> <b>Classes:</b> {review.classes}</p>
                  <p> <b>Activities:</b> {review.activities}</p>
                  <p> <b>Staff:</b> {review.staff}</p>
                  {review.photos.length > 0 ? <h3> Photos: </h3> : null}
                  {review.photos.map((photo) =>
                    <div className="photo" key={photo.url}>
                      <FormControlLabel
                        control={<Switch color="primary" checked={Boolean(photo.approved)}></Switch>}
                        label="Approve"
                        onChange={(event) => {
                          if(event.target.checked) {
                            photo.approved = true;
                            this.forceUpdate();
                          } else {
                            photo.approved = false;
                            this.forceUpdate();
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
          {this.state.extraPhotos.length > 0 ?
            <Paper>
              <div>
                <br/>
                {!this.state.loading ? <h3> Additional Photos </h3> : null}
                {this.state.extraPhotos.map((photo) => {
                  return (
                    <div className="photo" key={photo.url}>
                      <FormControlLabel
                        control={<Switch color="primary" checked={Boolean(photo.approved)}></Switch>}
                        label="Approve"
                        onChange={(event) => {
                          if(event.target.checked) {
                            photo.approved = true;
                            this.forceUpdate();
                          } else {
                            photo.approved = false;
                            this.forceUpdate();
                          }
                        }}>
                      </FormControlLabel> <br/>
                      <img src={photo.url} width={photo.width} height={photo.height} alt=""></img>
                    </div>
                  );})}
              </div>
              <div style={{paddingBottom: '15px'}}>
                <Button variant="contained"
                  onClick = {(event) => {
                    this.setState({open: true})
                    this.savePhotos(this.state.extraPhotos)
                  }}>
                  Save </Button>
              </div>
            </Paper> : null}
          {(this.state.reviews.length === 0 && !this.state.loading) ? <p> No reviews to approve at this time! </p> : null}
          <Snackbar
              message={this.state.message}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={this.state.showMessage}
              autoHideDuration={3000}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={(event) => this.setState({showMessage: false})}>
                  <CloseIcon/>
                </IconButton>,
              ]}>
            </Snackbar>
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
