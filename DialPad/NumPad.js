import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MAIN_GRAY } from 'components/Styled/constants';

export const Wrapper = styled.div`
  display: flex;
  flex: 1 auto;
  flex-direction: column;
  justify-content: ${(props) => (props.center) ? 'center' : 'start'};
  align-items: center;
  border: 1px solid ${MAIN_GRAY};
  padding: 5px;
  
  &:hover {
    cursor: pointer;
    background-color: ${MAIN_GRAY};
  }
`;

const Number = styled.div`
  font-size: 1.5em;
`;

const Text = styled.div`
  font-size: 0.6em;
`;

const NumPad = (props) => (
  <Wrapper onClick={props.onClick} center={props.center}>
    <Number>{props.number}</Number>
    { props.text &&
      <Text>{props.text}</Text>
    }
  </Wrapper>
);

NumPad.propTypes = {
  center: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  number: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

NumPad.defaultProps = {
  center: false,
  text: '',
  onClick: null,
};

export default NumPad;
