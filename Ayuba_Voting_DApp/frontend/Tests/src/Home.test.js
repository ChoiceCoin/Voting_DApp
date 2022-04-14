import {shallow} from 'enzyme';
import React from 'react';
import Home from './Home';

describe("Test On Home.js", ()=> {
    
    it('expects to render Home component', () => {
        expect(shallow(<Home/>).length).toEqual(1)
    })
    
    
    it('expects to render Home component', () => {
        expect(shallow(<Home/>)).toMatchSnapshot();
    })
    
})


