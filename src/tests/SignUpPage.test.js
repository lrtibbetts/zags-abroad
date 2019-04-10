import React from 'react'
import SignUpPage from '../SignUpPage.js'
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Signup page', () => {
    const signUpPage = shallow(<SignUpPage/>);

    it('should render correctly with header', () => {
      expect(signUpPage.contains(<h1 style={{color: '#06274F'}}> Sign Up </h1>)).toBe(true);
    });

    it('should get email from user correctly', () => {
      signUpPage.find('#email').simulate('change', {target: {name: 'email', value: 'test@gonzaga.edu'}});
      expect(signUpPage.state('email')).toEqual('test@gonzaga.edu');
    });

    it('should display "wrong email" message appropriately', () => {
      signUpPage.setState({emailError : true})
      expect(signUpPage.find('#email').props().helperText).toEqual("Please enter a Gonzaga email");
    });

    it('should get password from user correctly', () => {
      signUpPage.find('#password').simulate('change', {target: {name: 'password', value: 'helloworld'}});
      expect(signUpPage.state('password')).toEqual('helloworld');
    });

    it('should get confirmedpassword from user correctly', () => {
      signUpPage.find('#confirmedPassword').simulate('change', {target: {name: 'confirmedPassword', value: 'helloworld'}});
      expect(signUpPage.state('confirmedPassword')).toEqual('helloworld');
    });

    it('should display "non-matching password" message appropriately', () => {
      signUpPage.setState({passwordMatchingError: true})
      expect(signUpPage.find('#confirmedPassword').props().helperText).toEqual("Please enter a matching password");
    });

    it('should display "short password length" message appropriately', () => {
      signUpPage.setState({passwordLengthError: true})
      expect(signUpPage.find('#password').props().helperText).toEqual("Please enter at least 8 characters");
    });

});
