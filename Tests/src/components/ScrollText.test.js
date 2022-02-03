import React from 'react';
import {shallow} from 'enzyme';
import ScrollText from './ScrollText';
describe("test on ScrollText component", () => {
    it('expects to render ScrollText component', () => {
        expect(shallow(<ScrollText/>).length).toEqual(1)
    })
    it('expects to render ScrollTextLand component', () => {
        expect(shallow(<ScrollText/>)).toMatchSnapshot();
    })
})