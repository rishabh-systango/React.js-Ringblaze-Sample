/**
*
* ContactDetail
*
*/

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import callsIcon from './images/calls.svg';
import messagesIcon from './images/messages.svg';
import callNumberIcon from './images/webIcon_contact_profile_nr.svg';
import emailIcon from './images/webIcon_contact_profile_e-mail.svg';
import contactNoteIcon from './images/webIcon_contactDetail_note.svg';
import contactAddressIcon from './images/webIcon_contact_profile_addr.svg';
import profileBlank from './images/webIcon_profilePicBlank.svg';

const Wrapper = styled(Row)`
  .user-title {
    margin-top: 20px;
    font-weight: bold;
  }

  .details {
    font-weight: normal;
  }

  .details .icon-details {
    margin-right: 1rem;
    margin-top: 0.5rem;
  }

  .details .icon-details img {
    width: 20px;
  }
`;

class ContactDetail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { item } = this.props;
    return (
      <Wrapper>
        <Col lg={{ size: 5 }} className="text-center p-3">
          <Col className="text-center">
            <img width="200" height="110" alt="user-profile" src={profileBlank} />
          </Col>
          <h5 className="user-title">{item.firstName ? item.firstName : '-'} {item.lastName ? item.lastName : '-'}</h5>
          <p>{item.title ? item.title : '-'}</p>
          <Col>     
            <img alt="Calls" src={callsIcon} width="35" height="43" className="mr-3" /><img alt="Messages" src={messagesIcon} width="35" height="43" />
          </Col>
        </Col>
        <Col lg={{ size: 7 }} className="details p-3">
          <ul className="list-unstyled ">
            <li className="d-flex flex-row"><span className="icon-details"><img alt="" src={callNumberIcon} /></span> <span className="p-2"> {item.personalPhone ? item.personalPhone : '-'}</span></li>
            <li className="d-flex flex-row"><span className="icon-details"><img alt="" src={emailIcon} /></span> <span className="p-2"> {item.email ? item.email : '-'}</span></li>
            <li className="d-flex flex-row"><span className="icon-details"><img alt="" src={contactAddressIcon} /></span>
              <span className="p-2">
                {item.street1 && <span>{item.street1}, </span>}
                {item.street2 && <span>{item.street2}, </span>}
                {item.city && <span>{item.city}, </span>}
                {item.state && <span>{item.state}, </span>}
                {item.country && <span>{item.country}</span>}
                {item.country || item.city || item.state || item.street1 || item.street2 ? '' : '-'}
              </span>
            </li>
            <li className="d-flex flex-row"><span className="icon-details"><img alt="" src={contactNoteIcon} /></span> <span className="p-2">{item.note ? item.note : '-'}</span></li>
          </ul>
        </Col>
      </Wrapper>
    );
  }
}

ContactDetail.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ContactDetail;
