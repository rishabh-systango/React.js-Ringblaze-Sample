import React from 'react';
import { shallow } from 'enzyme';
import { DialPad } from '../index';

jest.useFakeTimers();
jest.mock('utils/twilio');

window.Twilio = {
  Device: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    disconnectAll: jest.fn(),
    setup: jest.fn(),
  },
};

describe('DialPad', () => {
  let props;
  
  beforeEach(() => {
    props = {
      getPhoneNumber: {
        Phone: {
          number: '+17141112222',
        },
      },
      intl: {
        formatMessage: jest.fn(),
      },
    };
  });

  describe('componentDidMount', () => {
    it('should call twilioSetup()', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.twilioSetup = jest.fn();
      inst.componentDidMount();
      expect(inst.twilioSetup).toBeCalled();
    });
  });

  describe('render()', () => {  
    it('should render', () => {
      const wrapper = shallow(<DialPad {...props} />);
      expect(wrapper.type().displayName).toEqual('DialPad__Col');
    });
  
    it('should show the hang up icon when the call is active', () => {
      const wrapper = shallow(<DialPad {...props} />);
      wrapper.setState({ callActive: true });
      expect(wrapper.find('#hangUp')).toHaveLength(1);
    });
  });
  
  describe('handleCall()', () => {  
    it('should start callTimer', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const e = { target: { textContent: '123' } };
      inst.changeInputValueFromNumpad(e);
      inst.setState({ number: '123' });
      inst.handleCall();
  
      // Fast forward and exhaust only currently pending timers
      // (but not any new timers that get created during that process)
      jest.runOnlyPendingTimers();
  
      expect(inst.state.callTimer).toBe(1);
      expect(inst.state.callActive).toBe(true);
    });

    it('should call Twilio.Device.connect()', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.setState({ number: '123' });
      inst.handleCall();

      expect(inst.Twilio.Device.connect).toHaveBeenCalledWith({
        From: props.getPhoneNumber.Phone.number,
        To: '123',
      });
    });
  });
  
  describe('hangUp()', () => {  
    it('should stop callTimer', () => {
      jest.clearAllTimers();
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.setState({ callTimer: 1 });
      inst.setState({ callActive: true });
      inst.hangUp();
      jest.runOnlyPendingTimers();

      expect(inst.state.callActive).toBe(false);
      expect(inst.state.callTimer).toBe(0);
    });

    it('should call Twilio.Device.disconnectAll()', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.hangUp();

      expect(inst.Twilio.Device.disconnectAll).toBeCalled();
    });
  });

  describe('twilioSetup()', () => {
    it('should call twilio.Device.setup()', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.twilioSetup();

      expect(inst.Twilio.Device.setup).toBeCalled();
      expect(inst.Twilio.Device.disconnect).toBeCalled();
    });
  });
  
  describe('formattedSeconds()', () => {  
    it('should call formattedSeconds & display formattedTime', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const result = inst.formattedSeconds(200000);
      expect(result).toBe('55:33:20');
    });
  
    it('should not include the hours portion if it is less than 1 hour', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const result = inst.formattedSeconds(80);
      expect(result).toBe('01:20');
    });
  });
    
  describe('onInputChange()', () => {
    it('should change state: value for onInputChange', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      inst.onInputChange('2');
      expect(inst.state.number).toEqual('2');
    });
  });
  
  describe('handleTapEvent()', () => {
    it('should change state: value for handleTapEvent', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const nextValue = inst.state.number.concat('0');
      inst.handleTapEvent();
      expect(inst.state.number).toEqual(nextValue);
    });
  });
  
  describe('handlePressEventForPlus()', () => {
    it('should change state: value for handlePressEventForPlus', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const nextValue = inst.state.number.concat('+');
      inst.handlePressEventForPlus();
      expect(inst.state.number).toEqual(nextValue);
    });
  });
  
  describe('changeInputValueFromNumpad()', () => {
    const e = { target: { textContent: '2' } };
  
    it('should change state: value for changeInputValueFromNumpad', () => {
      const wrapper = shallow(<DialPad {...props} />);
      const inst = wrapper.instance();
      const nextValue = inst.state.number.concat('2');
      inst.changeInputValueFromNumpad(e);
      expect(inst.state.number).toEqual(nextValue);
    });
  });
});

