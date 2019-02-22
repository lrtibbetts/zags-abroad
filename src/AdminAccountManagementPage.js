import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class AdminAccountManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      loading: true,
      showMessage: false,
      message: ''
    }
    this.loadAccounts();
  }

  displayMessage(message) {
    this.setState({showMessage: true, message: message});
  }

  loadAccounts() {
    axios.get("https://zagsabroad-backend.herokuapp.com/adminaccounts").then ((res) => {
      let accountsToAdd = [];
      for(var i = 0; i < res.data.length; i++) {
        let account = {first: res.data[i].first_name, last: res.data[i].last_name, email: res.data[i].email, isAdmin: res.data[i].is_admin};
        accountsToAdd.push(account);
      }
      this.setState({accounts: accountsToAdd, loading: false});
    })
  }

  saveChanges(account, event) {
    if(event.target.checked) {
      axios.post("https://zagsabroad-backend.herokuapp.com/approveadmin", {"email": account.email}).then((res) => {
        this.displayMessage(account.email + " has been given admin access");
        this.loadAccounts();
      })
    } else {
      axios.post("https://zagsabroad-backend.herokuapp.com/rejectadmin", {"email": account.email}).then((res) => {
        this.displayMessage("Admin access has been removed for " + account.email);
        this.loadAccounts();
      })
    }
  }

  render() {
    const cookies = this.props.cookies;
    if(cookies.get('role') === 'admin') {
      return (
        <div style={{textAlign: 'center', marginLeft: '5%', marginRight: '5%'}}>
          {this.state.accounts.map((account) => {
            return (
              <div key={account.email}>
                <Paper>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                        color="primary"
                        checked = {Boolean(account.isAdmin)}
                        onChange={(event) => {
                          this.saveChanges(account, event);
                        }}>
                        </Switch>}
                      label="Grant Access"
                      >
                      </FormControlLabel>
                      <p> <b>Name: </b> {account.first} {account.last} &nbsp;&nbsp; <b> Email: </b> {account.email}</p>
                  </div>
                </Paper><br/>
              </div>
            )
          })}
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
          {(this.state.accounts.length === 0 && !this.state.loading) ? <p> No accounts found at this time! </p> : null}
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

export default AdminAccountManagementPage
