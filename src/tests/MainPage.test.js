import React from 'react'
import MainPage from '../MainPage.js'
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Workaround to mock mapbox-gl
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
   Map: () => ({})
}));

describe('Main Page', () => {
    const mainPage = shallow(<MainPage/>);

    it('should set subject list correctly', () => {
      mainPage.setState({subjects: ['true']})
      expect(mainPage.find('#departments').props().options).toEqual(['true']);
    });

});
