import React, { Component } from 'react';
import './App.css';
import SignUpPage from "./SignUpPage.js";
import MainPage from "./MainPage.js";
import { BrowserRouter, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <MainPage />
            </div>
          )}/>
          <Route exact={true} path='/signup' render={() => (
            <div className="App">
              <SignUpPage />
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
