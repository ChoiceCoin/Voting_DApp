import {shallow} from 'enzyme';
import React from 'react';
import ScrollText from './ScrollText';

describe("Test On ScrollText.js", ()=> {
    
    it('expects to render ScrollText component', () => {
        expect(shallow(<ScrollText/>).length).toEqual(1)
    })
    
    
    it('expects to render ScrollText component', () => {
        expect(shallow(<ScrollText/>)).toMatchSnapshot();
    })
    
})
