import React from 'react';
import cx from 'classnames';
import './Responsive.scss';


const Responsive = ({ children, className, ...rest }) => {
  return (
    <div className={cx('common', 'responsive', className)} {...rest}>
      { children }
    </div>
  );
};

export default Responsive;
