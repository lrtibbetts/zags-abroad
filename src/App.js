import React, { Component } from 'react';
import './App.css';
import SignUpPage from "./SignUpPage.js";
import MainPage from "./MainPage.js";
import LogInPage from "./LogInPage.js";
import NavigationBar from "./NavigationBar.js";
import AdminPage from "./AdminPage.js";
import { BrowserRouter, Route } from "react-router-dom";

class App extends Component {
  // TODO: store state in cookies to persist data if a user refreshes the page
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn : false,
      isAdmin : false
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavigationBar isLoggedIn = {this.state.isLoggedIn} />
          <div className="App">
            <Route exact={true} path='/' render={() => (
                <MainPage />
            )}/>
            <Route exact={true} path='/signup' render={() => (
                <SignUpPage />
            )}/>
            <Route exact={true} path='/login' render={() => (
                <LogInPage />
            )}/>
            <Route exact={true} path='/admin' render={() => (
                <AdminPage />
            )}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
