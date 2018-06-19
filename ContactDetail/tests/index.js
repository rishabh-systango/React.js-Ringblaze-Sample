import React from 'react';
import { shallow } from 'enzyme';
import ContactDetail from '../index';

const item = {
  id: 8,
  firstName: 'Oma',
  lastName: 'Herman',
  email: 'holden_runolfsdottir48@gmail.com',
  personalPhone: '960-869-2026 x12078',
  workPhone: null,
  companyName: 'Hauck, Senger and Bins',
  title: 'Central Quality Orchestrator',
  street1: '75829 Hardy Lodge',
  street2: '#123',
  city: 'West Crawford',
  state: 'ABC',
  country: 'MH',
};

describe('<ContactDetail />', () => {
  it('Contacts should render styled Wrapper', () => {
    const wrapper = shallow(<ContactDetail item={item} />);
    expect(wrapper.type().displayName).toEqual('ContactDetail__Wrapper');
    const newwrapper = shallow(<ContactDetail item={{}} />);
    expect(newwrapper.contains('-')).toBe(true);
  });
});
