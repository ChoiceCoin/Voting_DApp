import {shallow} from 'enzyme';
import React from 'react';
import GetCommittedAmount from './GetCommittedAmount';
import * as redux from 'react-redux'
import {mockLocalStorage} from './LocalStorageMock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { URL } from "./constants";

const { getItemMock, setItemMock } = mockLocalStorage();

describe("test on GetCommittedAmount Component", ()=> {
 

    const spy = jest.spyOn(redux, 'useSelector')
    spy.mockReturnValue({ AddressNum: 1 })

  

    it('expects to render GetCommittedAmount Component', ()=> {
        getItemMock.mockReturnValue('address');
        expect(setItemMock).not.toHaveBeenCalled();
       expect(shallow(<GetCommittedAmount/>)).toMatchSnapshot()
    })


    it('expects to render GetCommittedAmount Component', () => {
        getItemMock.mockReturnValue('address');
        expect(setItemMock).not.toHaveBeenCalled();
        // const wrapper = shallow(<GetCommittedAmount/>)
        // wrapper.find('[id ="amt"]')
        expect(shallow(<GetCommittedAmount/>).length).toEqual(1)
    })
})