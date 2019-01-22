import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import DropdownTextField from './DropdownTextField.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from "react-router-dom";

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
      terms: [{value:'Fall', label:'Fall'}, {value:'Spring', label:'Spring'},
       {value:'Summer', label:'Summer'}, {value:'Full year', label:'Full year'}],
      major: '',
      program: '',
      term: '',
      year: '',
      residence: '',
      trips: '',
      classes: '',
      activities: '',
      other: '',
      name: '',
      email: '',
      formSubmitted: ''
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
      "email" : this.state.email
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/submitsurvey", accountInfo).then((res) => {
        console.log(res.data);
        this.setState({formSubmitted: true});
    });
  }

  render() {
    return(
      <div style={{textAlign: 'center'}}>
        <h3>Tell us about your time abroad!</h3>
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
        <div style={{width: 500, margin: '10px', display: 'inline-block', zIndex: 1}}>
          <DropdownTextField
            required={true}
            label="What term did you go abroad?"
            placeholder={this.state.term ? this.state.term : ""}
            options={this.state.terms}
            onChange={(selectedOption) =>
              this.setState({term : selectedOption.value})}/>
        </div>
        <br/>
        <TextField id="year" label="What year did you begin your study abroad program?"
          required={true}
          style={textFieldStyle}
          placeholder="E.g. 2017"
          onChange = { (event) =>
            this.setState({year : event.target.value})}/>
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
        <TextField id="other" multiline={true} rows={10} style={textFieldStyle}
          label = "Is there anything else you would like to share?"
          variant = "outlined"
          inputProps={{maxLength: 1000}}
          onChange = { (event) =>
            this.setState({other : event.target.value})}
          helperText = {(1000 - this.state.other.length) + ' characters remaining'}/>
        <br/>
        <p style = {{fontSize: '14px'}}> If you're open to being contacted by a
        prospective study abroad student, please <br/> provide your contact information: </p>
        <TextField id="name" label="Name" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({name : event.target.value})}/>
        <br/>
        <TextField id="email" label="Email" style={textFieldStyle}
          onChange = { (event) =>
            this.setState({email : event.target.value})}/>
        <br/>
        <Button label="submit" variant="contained" style={{margin: '10px'}}
          disabled = {!(this.state.major && this.state.program && this.state.term && this.state.year)}
          onClick = {(event) =>
            this.submit(event)}> Submit </Button>
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
