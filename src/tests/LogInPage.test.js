import React from 'react'
import LogInPage from '../LogInPage.js'
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Login page', () => {
    const logInPage = shallow(<LogInPage/>);

    it('should render correctly with header', () => {
      expect(logInPage.contains(<h1> Log In </h1>)).toBe(true);
    });

    it('should get email from user correctly', () => {
      logInPage.find('#email').simulate('change', {target: {name: 'email', value: 'test@gonzaga.edu'}});
      expect(logInPage.state('email')).toEqual('test@gonzaga.edu');
    });

    it('should get password from user correctly', () => {
      logInPage.find('#password').simulate('change', {target: {name: 'password', value: 'helloworld'}});
      expect(logInPage.state('password')).toEqual('helloworld');
    });

    it('should display "wrong password" message appropriately', () => {
      logInPage.setState({wrongPassword: true})
      expect(logInPage.find('#password').props().helperText).toEqual("Password is incorrect");
    });

    it('should display pop-up message appropriately', () => {
      logInPage.setState({wrongPassword: false, showPrompt: true})
      expect(logInPage.find('#dialog').props().open).toEqual(true);
    });

});
