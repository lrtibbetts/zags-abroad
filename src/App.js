import React, { Component } from 'react';
import SignUpPage from "./SignUpPage.js";
import MainPage from "./MainPage.js";
import LogInPage from "./LogInPage.js";
import NavigationBar from "./NavigationBar.js";
import AdminPage from "./admin/AdminPage.js";
import ProgramDetailView from "./ProgramDetailView.js";
import ProgramReviewForm from "./ProgramReviewForm.js";
import MyAccount from "./MyAccount.js"
import PasswordResetPage from "./PasswordResetPage.js";
import { BrowserRouter, Route } from "react-router-dom";
import { withCookies } from "react-cookie";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const font = "'Lato', sans-serif";
const muiTheme = createMuiTheme({
  typography: {
    fontFamily: font
  },
  palette: {
    primary: {
      main: '#06274F' // GU Blue
    },
    secondary: {
      main: '#CC0033' // Bulldog Red
    }
  },
  overrides: {
      MUIDataTableHeadCell: {
        root: {
          fontWeight: 700
        }
      },
      MuiButton: {
        outlined: {
          color: '#06274F',
          borderColor: '#06274F'
        },
        text: {
          color: '#06274F'
        },
        raised: {
          color: '#06274F',
          backgroundColor: 'rgb(94, 138, 180, 0.5)'
        }
      }
    }
});

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={muiTheme}>
          <div style={{fontFamily: font}}>
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
            <Route exact={true} path='/reset/:token' render={(props) => (
                <PasswordResetPage token={props.match.params.token} cookies = {this.props.cookies}/>
            )}/>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
