import React from 'react'
import LogInPage from '../LogInPage.js'
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Login page', function() {
    it('should render correctly with header', function () {
        expect(shallow(<LogInPage/>).contains(<h1> Log In </h1>)).toBe(true);
    });
});
