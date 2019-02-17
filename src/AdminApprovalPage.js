import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './ProgramReviewsApprovalPage.css';
import CircularProgress from '@material-ui/core/CircularProgress';


class AdminApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleAdmins: [],
      submitting: false,
      loading: false,
      open: false,
      check: false,
    }
    this.loadAccounts();
  }

  handleChange = name => event => {
   this.setState({ [name]: event.target.checked });
  };

  loadAccounts() {
    axios.get("https://zagsabroad-backend.herokuapp.com/adminaccounts").then ((res) => {
      let accountsToAdd = [];
      let i = 0;
      while (i < res.data.length) {
        accountsToAdd.push({first: res.data[i].first_name, last: res.data[i].last_name, email: res.data[i].email, approved: res.data[i]})
        i++
      }
      this.setState({possibleAdmins: accountsToAdd, loading: false, submitting: false})
      console.log(accountsToAdd);
    })
  }

  saveChanges(account) {
    this.setState({submitting: true, loading: true, possibleAdmins: []})
    if(account.is_admin) {
      axios.post("https://zagsabroad-backend.herokuapp.com/approveadmin", {"email": account.email}).then((res) => {
        console.log(res);
      })
    } else {
      axios.post("https://zagsabroad-backend.herokuapp.com/rejectadmin", {"email": account.email}).then((res) => {
        console.log(res);
      })
    }
    this.loadAccounts();
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', marginLeft: '5%', marginRight: '5%'}}>
          {this.state.possibleAdmins.map((account) => {
            let check = account.approved.is_admin;
            if (check === 1) {
              this.state.check = true
            } else {
              this.state.check = false
            }
            return (
              <div className="reviews" key={account.email}>
                <Paper>
                  <div style= {{textAlign: 'right', marginLeft: '10px'}}>
                    <FormControlLabel
                      control={
                        <Switch
                        color="primary"
                        checked = {this.state.check}
                        onChange={this.handleChange(account.email)}
                        > </Switch>}
                      label="Grant Access"
                      >
                      </FormControlLabel>
                      <p> <b>Name: </b> {account.first}  {account.last} &nbsp;&nbsp; <b> Email: </b> {account.email}</p>
                  </div>
                </Paper><br/>
              </div>
            )
          })}
          {(this.state.possibleAdmins.length === 0 && !this.state.loading) ? <p> No accounts found at this time! </p> : null}
          {this.state.submitting ? <p>LIT</p> : null}
           {this.state.loading ? <CircularProgress variant="indeterminate"/> : null}
        </div>
      )
    } else {
      return (
        <Redirect to="/"/>
      )
    }
  }
}

export default AdminApprovalPage;
