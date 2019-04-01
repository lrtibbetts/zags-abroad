import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const textFieldStyle = {
  width: 250,
  margin: '10px'
};

class PasswordResetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmedPassword: '',
      token: this.props.token
    }
  }

  resetPassword() {
    let params = {
      token: this.state.token,
      password: this.state.newPassword
    }
    axios.post("https://zagsabroad-backend.herokuapp.com/reset", params).then((res) => {
      console.log(res.data);

    });
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h3> Please enter a new password </h3>
        <TextField label="Password" style={textFieldStyle} type="password"
          onChange = { (event) =>
            this.setState({newPassword : event.target.value})}/>
        <br/>
        <TextField label="Confirm your password" style={textFieldStyle} type="password"
          onChange = { (event) =>
            this.setState({confirmedPassword : event.target.value})}/>
        <br/><br/>
        <Button variant="contained"
          disabled = {this.state.newPassword.length === 0 ||
          this.state.newPassword !== this.state.confirmedPassword}
          onClick = {(event) =>
            this.resetPassword()}> Reset password </Button> <br/>
      </div>
    );
  }
}

export default PasswordResetPage;
