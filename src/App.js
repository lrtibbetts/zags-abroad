import React, { Component } from 'react';
import SignUpPage from "./SignUpPage.js";
import MainPage from "./MainPage.js";
import LogInPage from "./LogInPage.js";
import NavigationBar from "./NavigationBar.js";
import AdminPage from "./AdminPage.js";
import ProgramDetailView from "./ProgramDetailView.js";
import ProgramReviewForm from "./ProgramReviewForm.js";
import MyAccount from "./MyAccount.js"
import { BrowserRouter, Route } from "react-router-dom";
import { withCookies } from "react-cookie";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavigationBar cookies = {this.props.cookies} />
          <Route exact={true} path='/' render={() => (
              <MainPage cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/signup' render={() => (
              <SignUpPage cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/login' render={() => (
              <LogInPage cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/admin' render={() => (
              <AdminPage cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/program/:name' render={(props) => (
              <ProgramDetailView name={props.match.params.name} cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/review' render={() => (
              <ProgramReviewForm cookies = {this.props.cookies}/>
          )}/>
          <Route exact={true} path='/account' render={() => (
              <MyAccount cookies = {this.props.cookies}/>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
