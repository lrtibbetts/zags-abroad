/*
This file contains code for the review form when the user clicks on "Already
studied abroad? Share here" (link in navigation bar).

Backend API calls:
/programs
/submitsurvey
/photos

* Also contains call to cloudinary photo storage
*/

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect, Link } from "react-router-dom";
import { DropzoneArea } from 'material-ui-dropzone';
import Tooltip from '@material-ui/core/Tooltip';

const textFieldStyle = {
  width: 500,
  margin: '20px',
  zIndex: 0,
};

class ProgramReviewForm extends Component {
  constructor(props) {
    super(props);
    let thisYear = (new Date()).getFullYear();
    var calendarYears = []
    for(let year = thisYear; year >= 2000; year--) {
      calendarYears.push({value: year, label: year});
    }
    this.state = {
      programs: [],
      years: [{value:'Freshman', label:'Freshman'}, {value:'Sophomore', label:'Sophomore'},
       {value:'Junior', label:'Junior'}, {value:'Senior', label:'Senior'}],
      calendarYears: calendarYears,
      terms: [{value: 'Fall', label: 'Fall'}, {value: 'Spring', label: 'Spring'},
      {value: 'Summer', label: 'Summer'}, {value: 'Full year', label: 'Full year'}],
      name: '',
      email: '',
      major: '',
      program: this.props.program,
      term: '',
      calendarYear: '',
      year: '',
      residence: '',
      trips: '',
      classes: '',
      activities: '',
      staff: '',
      reviewId: 0,
      formSubmitted: '',
      photos: [],
      timestamp: '',
    }
    // Get list of programs for dropdown menu
    axios.get("https://zagsabroad-backend.herokuapp.com/programs").then((res) => {
      let programsToAdd = [];
      for(let i = 0; i < res.data.length; i++) {
        let program = res.data[i].host_program;
        let programObj = {value: program, label: program};
        programsToAdd.push(programObj);
      }
      this.setState({programs: programsToAdd});
    });

  }

  // Send survey to database
  submitReview() {
    this.getTime()
    var accountInfo = {
      "major" : this.state.major,
      "program" : this.state.program,
      "term" : this.state.term,
      "calendar_year": this.state.calendarYear,
      "year" : this.state.year,
      "residence" : this.state.residence,
      "trips" : this.state.trips,
      "classes" : this.state.classes,
      "activities" : this.state.activities,
      "name" : this.state.name,
      "email" : this.state.email,
      "staff" : this.state.staff,
      "timestamp" : this.state.timestamp,
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/submitsurvey", accountInfo).then((res) => {
      this.setState({formSubmitted: true, reviewId: res.data.insertId}, () => {
        this.handleUploadImages(this.state.photos);
      });  // Upload images after review is submitted
    });
  }

  getTime() {
    let date = new Date();
    let hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if(hours === 0) {
      hours = 12;
    }
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear() + "\n" + hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  // Called in submitReview() after review is submitted
  handleUploadImages = images => {
    for(let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
      formData.append("upload_preset", "bdbcyhiw"); // Preset name
      formData.append("api_key", "{447116233167845}"); // Cloudinary API key
      // Upload to Cloudinary, store info in database
      axios.post("https://api.cloudinary.com/v1_1/zagsabroad/image/upload", formData).then(response => {
          let url = response.data.secure_url.replace('upload', 'upload/a_exif');
          console.log(url);
          var upload = {
            "program" : this.state.program, "url" : url, "height" : response.data.height,
            "width": response.data.width, "survey_id" : this.state.reviewId
          }
          console.log(response);
          axios.post("https://zagsabroad-backend.herokuapp.com/photos", upload).then((res) => {
            console.log(res.data);
          });
      });
    }
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'user' || cookies.get('role') === undefined) {
      return(
        <div style={{textAlign: 'center'}}>
          <h3 style={{color: '#06274F'}}>Tell us about your time abroad!</h3>
          <TextField id="name" label="Name" style={textFieldStyle}
            onChange = { (event) =>
              this.setState({name : event.target.value})}/>
          <br/>
          <TextField id="email" label="Email" style={textFieldStyle}
            onChange = { (event) =>
              this.setState({email : event.target.value})}/>
          <br/>
          <TextField id="required" label="What was your major?" required={true} style ={textFieldStyle}
            onChange = { (event) =>
              this.setState({major : event.target.value})}/>
          <br/>
          <div style={{width: 500, margin: '10px', display: 'inline-block', zIndex: 1}}>
            <DropdownTextField
              required={true}
              label="What study abroad program did you participate in?"
              placeholder={this.state.program ? this.state.program : ""}
              options={this.state.programs}
              onChange={(selectedOption) =>
                this.setState({program : selectedOption.value})}/>
          </div>
          <br/>
          <div style={{width: 240, margin: '10px', display: 'inline-block', zIndex: 1}}>
            <DropdownTextField
              required={true}
              label="When did you study abroad?"
              placeholder={this.state.term ? this.state.term : ""}
              options={this.state.terms}
              onChange={(selectedOption) =>
                this.setState({term : selectedOption.value})}/>
          </div>
          <div style={{width: 240, margin: '10px', display: 'inline-block', zIndex: 1,
          verticalAlign: 'bottom'}}>
            <DropdownTextField
            required={true}
            placeholder={this.state.calendarYear ? this.state.calendarYear : ""}
            options={this.state.calendarYears}
            onChange={(selectedOption) =>
            this.setState({calendarYear : selectedOption.value})}/>
          </div><br/>
          <div style={{width: 500, margin: '10px', display: 'inline-block', zIndex: 1}}>
            <DropdownTextField
              required={true}
              label="What year at Gonzaga did you study abroad?"
              placeholder={this.state.year ? this.state.year : ""}
              options={this.state.years}
              onChange={(selectedOption) =>
                this.setState({year : selectedOption.value})}/>
          </div><br/>
          <TextField id="residence" multiline={true} rows={10} style={textFieldStyle}
            label="Where did you stay while abroad? What was it like?"
            placeholder = "E.g. homestay, dormitory, etc."
            variant = "outlined"
            inputProps={{maxLength: 1000}}
            onChange = { (event) =>
              this.setState({residence : event.target.value})}
            helperText = {(1000 - this.state.residence.length) + ' characters remaining'}/>
          <br/>
          <TextField id="trips" multiline={true} rows={10} style={textFieldStyle}
            label = "Tell us about any favorite trips you took while abroad."
            placeholder = "Include any places you recommend, travel advice, etc."
            variant = "outlined"
            inputProps={{maxLength: 1000}}
            onChange = { (event) =>
              this.setState({trips : event.target.value})}
            helperText = {(1000 - this.state.trips.length) + ' characters remaining'}/>
          <br/>
          <TextField id="classes" multiline={true} rows={10} style={textFieldStyle}
            label = "What were your classes like?"
            placeholder = "E.g. any favorite classes, overall workload, etc."
            variant = "outlined"
            inputProps={{maxLength: 1000}}
            onChange = { (event) =>
              this.setState({classes : event.target.value})}
            helperText = {(1000 - this.state.classes.length) + ' characters remaining'}/>
          <br/>
          <TextField id="activities" multiline={true} rows={10} style={textFieldStyle}
            label = "Tell us about any extracurricular activities you participated in"
            placeholder = "E.g. sports teams, volunteering, clubs, etc."
            variant = "outlined"
            inputProps={{maxLength: 1000}}
            onChange = { (event) =>
              this.setState({activities : event.target.value})}
            helperText = {(1000 - this.state.activities.length) + ' characters remaining'}/>
          <br/>
          <TextField id="staff" multiline={true} rows={10} style={textFieldStyle}
            label = "What were your experiences with on-campus staff and facilities?"
            placeholder = "E.g. Health center, gym, library, etc."
            variant = "outlined"
            inputProps={{maxLength: 1000}}
            onChange = { (event) =>
              this.setState({staff : event.target.value})}
            helperText = {(1000 - this.state.staff.length) + ' characters remaining'}/>
          <br/>
          <p>Please share some photos from your time abroad! <br/> (Only PNG and JPEG files allowed)</p>
          <div style={{width: '50%', display: 'inline-block'}}>
            <DropzoneArea
              acceptedFiles={["image/jpeg", "image/png"]}
              filesLimit={20}
              onChange={(photos) => {this.setState({photos: photos})}}
              dropzoneText="Drag and drop an image or click here"
              showFileNamesInPreview={true}
              maxFileSize={5000000}/>
          </div>
          <br/>
          <Tooltip title={!(this.state.major && this.state.program && this.state.term && this.state.calendarYear
          && this.state.year) ? "Please fill out required fields" : ""} placement="top">
            <span style={{margin: '0 auto', marginBottom: '5px'}}>
              <Button label="submit" variant="contained" style={{margin: '10px', fontWeight: '700'}}
                disabled = {!(this.state.major && this.state.program && this.state.term && this.state.calendarYear
                && this.state.year)}
                onClick = {(event) => {
                  var time = this.getTime();
                  this.setState({timestamp: time}, () => {
                    this.submitReview();
                  });
                }}> Submit </Button>
                </span>
              </Tooltip>
          {this.state.formSubmitted ?
            <Dialog id="dialog" open={true}>
              <DialogTitle id="simple-dialog-title">Thanks for sharing!</DialogTitle>
              <div>
                <Button style={{margin: '10px', fontWeight: '700'}} variant="contained" component={Link} to="/">
                  Return to home
                </Button>
              </div>
            </Dialog> : null}
        </div>
      );
    } else {
      return (
        <Redirect to="/admin"/>
      );
    }
  }
}
export default ProgramReviewForm;
