import React from 'react';
import Icon from 'react-icon-base';

const Spinner = (props) => {
  return (
    <Icon viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" fill="none" strokeLinecap="round" r="16" strokeWidth="8" stroke="currentColor" strokeDasharray="25.132741228718345 25.132741228718345" transform="rotate(126 50 50)">
        <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite" />
      </circle>
    </Icon>
  );
};

export default Spinner;
