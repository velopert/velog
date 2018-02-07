import React from 'react';
import './WriteTemplate.scss';

const WriteTemplate = ({ header, children }) => {
  return (
    <div className="WriteTemplate">
      {header}
      <div className="rest">
        { children }
      </div>
    </div>
  );
};

export default WriteTemplate;