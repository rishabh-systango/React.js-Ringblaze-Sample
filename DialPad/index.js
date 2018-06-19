/**
*
* DialPad
*
*/
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import React from 'react';
import { Col as rCol, Row } from 'reactstrap';
import styled from 'styled-components';
import Tappable from 'react-tappable';
import Phone from 'react-phone-number-input';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import LoadingOverlay from 'components/LoadingOverlay';
import { getCapabilityToken } from 'utils/twilio';

import 'script-loader!twilio'; // eslint-disable-line import/no-unresolved

import NumPad from './NumPad';
import callsIcon from './images/calls.svg';
import messagesIcon from './images/messages.svg';
import hangUpCall from './images/HangUpOff.svg';
import messages from './messages';

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  div {
    padding: 20px;
    cursor: pointer;
  }
`;

const Col = styled(rCol)`
  display: flex;
  flex-direction: column;
`;

const Numbers = styled.div`
  margin: 0 -15px;
  
  .row {
    .col:nth-child(n + 2) {
      margin-left: -1px;
    }
  }
  
  .row:nth-child(n + 2) {
    margin-top: -1px;
  }
`;

const CallInProgress = styled.span`
  padding-top: 10px 0;
  margin-top: 20px;
  margin-bottom: -15px;
  div {
    color: red;
  }
  text-align: center;
`;


export class DialPad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      callActive: false,
      callTimer: 0,
      loading: true,
    };
    this.incrementer = null;
    this.Twilio = null;
    this.handleTapEvent = this.handleTapEvent.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handlePressEventForPlus = this.handlePressEventForPlus.bind(this);
    this.changeInputValueFromNumpad = this.changeInputValueFromNumpad.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.hangUp = this.hangUp.bind(this);
  }

  componentDidMount() {
    const self = this;
    const checkTwilioInstance = () => {
      if (window.Twilio) {
        clearInterval(timer);
        self.setState({ loading: false });
        self.twilioSetup();
      }
    };

    const timer = setInterval(checkTwilioInstance, 1000);
    checkTwilioInstance();
  }

  componentWillUnmount() {
    clearInterval(this.incrementer);    
  }

  onInputChange(e) {
    this.setState({ number: e });
  }

  formattedSeconds = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec - (hours * 3600)) / 60);
    const seconds = totalSec - (hours * 3600) - (minutes * 60);
    return (`${hours > 0 ? `${(`0${hours}`).slice(-2)}:` : ''}${(`0${minutes}`).slice(-2)}:${(`0${seconds}`).slice(-2)}`);
  }

  hangUp() {
    this.Twilio.Device.disconnectAll();
    clearInterval(this.incrementer);

    this.setState({
      callActive: false,
      callTimer: 0,
    });
  }

  handleCall() {
    if (this.state.number.length > 0) {
      this.incrementer = setInterval(() =>
        this.setState({
          callTimer: this.state.callTimer + 1,
          callActive: true,
        })
        , 1000);

      // Call the number
      this.Twilio.Device.connect({
        From: this.props.getPhoneNumber.Phone.number,
        To: this.state.number,
      });
    }
  } 

  handleTapEvent() {
    const number = this.state.number;
    this.setState({ number: number.concat('0') });
  }

  handlePressEventForPlus() {
    const number = this.state.number;
    this.setState({ number: number.concat('+') });
  }

  changeInputValueFromNumpad(e) {
    const number = this.state.number;
    this.setState({ number: number.concat(e.target.textContent[0]) });
  }

  twilioSetup() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    this.Twilio = window.Twilio;

    this.Twilio.Device.setup(getCapabilityToken(), {
      debug: isDevelopment,
      closeProtection: true,
      warnings: isDevelopment,
    });

    this.Twilio.Device.disconnect(this.hangUp);
  }

  render() {
    const intl = this.props.intl;
    let actionItems;
    if (this.state.callActive) {
      actionItems = (
        <Actions>
          <div onClick={this.hangUp}>
            <img id="hangUp" alt="Hang up" src={hangUpCall} width="42" height="50" />
          </div>
        </Actions>
      );
    } else {
      actionItems = (<Actions>
        <div onClick={this.handleCall}>
          <img id="call" alt="Call" src={callsIcon} width="35" height="43" />
        </div>
        <div>
          <img alt="Messages" src={messagesIcon} width="35" height="43" />
        </div>
      </Actions>);
    }

    return (
      <Col id="dialpad">
        <LoadingOverlay loading={this.state.loading} />
        {this.state.callActive ?
          <CallInProgress>
            <h6>
              {this.state.number}
            </h6>
            <div>{this.formattedSeconds(this.state.callTimer)}</div>
          </CallInProgress> :        
          <Phone
            country="US"
            placeholder={intl.formatMessage({ ...messages.search_placeholder })}
            value={this.state.number}
            onChange={this.onInputChange}
          />
        }
        <br />
        <Numbers className="pt-3">
          <Row noGutters>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="1" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="2" text="ABC" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="3" text="DEF" />
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="4" text="GHI" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="5" text="JKL" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="6" text="MNO" />
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="7" text="PQRS" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="8" text="TUV" />
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} number="9" text="WXYZ" />
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} center number="*" />
            </Col>
            <Col>
              <Tappable pressDelay={3000} onTap={this.handleTapEvent} onPress={this.handlePressEventForPlus}>
                <NumPad number="0" text="+" /></Tappable>
            </Col>
            <Col>
              <NumPad onClick={this.changeInputValueFromNumpad} center number="#" />
            </Col>
          </Row>
        </Numbers>
        {actionItems}
      </Col>
    );
  }
}

DialPad.propTypes = {
  getPhoneNumber: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(DialPad);

