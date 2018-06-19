import React from 'react';
import { shallow } from 'enzyme';

import NumPad, { Wrapper } from '../NumPad';

describe('<NumPad />', () => {
  it('should render', () => {
    const wrapper = shallow(<NumPad center />);
    expect(wrapper.type().displayName).toEqual('NumPad__Wrapper');
  });

  it('should render without props', () => {
    const wrapper = shallow(<Wrapper> <NumPad /> </Wrapper>);
    expect(wrapper.find(NumPad)).toHaveLength(1);
  });
});
