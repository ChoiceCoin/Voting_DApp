import {shallow} from 'enzyme';
import React from 'react';
import Landing from './Landing';

describe("Test On Landing.js", ()=> {

it('expects to render Landing component', () => {
        expect(shallow(<Landing/>).length).toEqual(1)
    })

it('expects to render Landing component', () => {
    expect(shallow(<Landing/>)).toMatchSnapshot();
})

})