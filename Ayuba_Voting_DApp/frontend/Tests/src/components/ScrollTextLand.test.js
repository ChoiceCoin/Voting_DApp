import React from 'react';
import {shallow} from 'enzyme';
import ScrollTextLand from './ScrollTextLand';
describe("test on ScrollTextLand component", () => {
    it('expects to render ScrollTextLand component', () => {
        expect(shallow(<ScrollTextLand/>).length).toEqual(1)
    })
    it('expects to render ScrollTextLand component', () => {
        expect(shallow(<ScrollTextLand/>)).toMatchSnapshot();
    })
})