import React from 'react';
import {shallow} from 'enzyme';
import Faq from './index';

describe("test on Faq component", () => {
    it('expects to render Faq component', () => {
        expect(shallow(<Faq/>).length).toEqual(1)
    })
    it('expects to render Faq component', () => {
        expect(shallow(<Faq/>)).toMatchSnapshot();
    })
})