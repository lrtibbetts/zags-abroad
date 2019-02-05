import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from "react-router-dom";
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import {DropzoneArea} from 'material-ui-dropzone';

const textFieldStyle = {
  width: 500,
  margin: '20px',
  zIndex: 0
};

class ProgramReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      years: [{value:'Freshman', label:'Freshman'}, {value:'Sophomore', label:'Sophomore'},
       {value:'Junior', label:'Junior'}, {value:'Senior', label:'Senior'}],
      name: '',
      email: '',
      major: '',
      program: '',
      term: '',
      year: '',
      residence: '',
      trips: '',
      classes: '',
      activities: '',
      staff: '',
      other: '',
      formSubmitted: '',
      accepted: [],
      photos: []
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

//call on the survey table
  submit(event) {
    var accountInfo = {
      "major" : this.state.major,
      "program" : this.state.program,
      "term" : this.state.term,
      "year" : this.state.year,
      "residence" : this.state.residence,
      "trips" : this.state.trips,
      "classes" : this.state.classes,
      "activities" : this.state.activities,
      "other" : this.state.other,
      "name" : this.state.name,
      "email" : this.state.email,
      "staff" : this.state.staff,
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/submitsurvey", accountInfo).then((res) => {
        console.log(res.data);
        this.setState({formSubmitted: true});
    });
  }

//this is called in the onclick for the submit button
  handleUploadImages = images => {

    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {
      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("tags", this.state.program); // image tags - {Array} OPTIONAL
      formData.append("upload_preset", "bdbcyhiw"); // preset name
      formData.append("api_key", "{447116233167845}"); // Cloudinary API key

      // cloudinary upload URL
      return axios.post(
        "https://api.cloudinary.com/v1_1/zagsabroad/image/upload",
        formData,
        { headers: { "X-Requested-With": "XMLHttpRequest" }})
        .then(response => {
          var upload = {
            "program" : this.state.program,
            "photos" : response.data.secure_url
          }
          console.log("UPLOAD: " + upload)
          axios.post("https://zagsabroad-backend.herokuapp.com/photos", upload).then((res) => {
            console.log("SUCCESS")
            console.log(res)
          }
          )
        })
    });

    // perform concurrent image upload to cloudinary
    axios.all(uploads).then(() => {
      // ... after successful upload
      console.log('Images have all being uploaded')
    });
  }


  render() {
    return(
      <div style={{textAlign: 'center'}}>
        <h3>Tell us about your time abroad!</h3>
        <TextField id="name" label="Name" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({name : event.target.value})}/>
        <br/>
        <TextField id="email" label="Email" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({email : event.target.value})}/>
        <br/>
        <TextField id="major" label="What is your major?" required={true} style={textFieldStyle}
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
        <div >
          <TextField id = "term"
            required={true}
            label="What term did you go abroad?"
            placeholder="E.g. Fall 2017"
            style ={textFieldStyle}
            onChange={(event) =>
              this.setState({term : event.target.value})}/>
        </div>
        <br/>
        <div style={{width: 500, margin: '10px', display: 'inline-block', zIndex: 1}}>
          <DropdownTextField
            required={true}
            label="What year did you study abroad?"
            placeholder={this.state.year ? this.state.year : ""}
            options={this.state.years}
            onChange={(selectedOption) =>
              this.setState({year : selectedOption.value})}/>
        </div>
        <br/>
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
          label = "Tell us about any favorite trips you took while abroad"
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
        <TextField id="other" multiline={true} rows={10} style={textFieldStyle}
          label = "Is there anything else you would like to share?"
          variant = "outlined"
          inputProps={{maxLength: 1000}}
          onChange = { (event) =>
            this.setState({other : event.target.value})}
          helperText = {(1000 - this.state.other.length) + ' characters remaining'}/>
        <br/>
        <p>Please share some photos of your travels by clicking the button below! <br/> (Only PNG and JPEG files allowed)</p>
        <Dropzone
          accept = "image/png, image/jpeg"
          onDrop={(accepted) => {this.setState({accepted})}}>
                    {({getRootProps, getInputProps, isDragActive}) => {
                      return (
                        <div
                          {...getRootProps()}
                          className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                        >
                          <input {...getInputProps()} />
                          {
                            isDragActive ?
                            <div style={{width: 500, display: 'inline-block'}}>
                            <DropzoneArea
                              acceptedFiles={["image/jpeg", "image/png"]}
                              filesLimit={10}
                              onChange={(accepted) => {this.setState({accepted})}}/>
                              </div>
                              :
                              <div style={{width: 500, display: 'inline-block'}}>
                              <DropzoneArea
                                acceptedFiles={["image/jpeg", "image/png"]}
                                filesLimit={10}
                                onChange={(accepted) => {this.setState({accepted})}}/>
                                </div>
                          }
                        </div>
                      )
                    }}
        </Dropzone>
        <aside>
          <h4>Selected Files:</h4>
          <ul style={{listStyleType: 'none'}}>
            {
              this.state.accepted.map(photo => <li key={photo.name}>{photo.name}</li>)
            }
          </ul>
        </aside>
        <br/>
        <Button label="submit" variant="contained" style={{margin: '10px'}}
          disabled = {!(this.state.major && this.state.program && this.state.term && this.state.year)}
          onClick = {(event) => {
            this.submit(event);
            let pics = this.state.accepted;
            console.log(pics);
            this.handleUploadImages(pics);
          }}> Submit </Button>
        {this.state.formSubmitted ?
          <Dialog id="dialog" open={true}>
            <DialogTitle id="simple-dialog-title">Thanks for sharing!</DialogTitle>
            <div>
              <Button style={{margin: '10px'}} variant="contained" component={Link} to="/">
                Return to home
              </Button>
            </div>
          </Dialog> : null}
      </div>
    );
  }
}

export default ProgramReviewForm;
