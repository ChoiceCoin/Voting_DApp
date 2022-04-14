import {shallow} from 'enzyme';
import React from 'react';
import CountdownTime from './CountdownTime';

describe("Test On CountdownTime.js", ()=> {
 
    const container = shallow(<CountdownTime />);

    it('should match the snapshot', () => {
      expect(container.html()).toMatchSnapshot();
    });

    it('expects to render countdown component', () => {
        expect(shallow(<CountdownTime/>).length).toEqual(1)
       
    })
    
    
    it('expects to render countdown component', () => {
        expect(shallow(<CountdownTime/>)).toMatchSnapshot();
    })
    
})
