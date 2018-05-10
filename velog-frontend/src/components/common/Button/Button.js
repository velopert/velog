// @flow
import React, { type Node } from 'react';
import cx from 'classnames';
import './Button.scss';

type Props = {
  theme: void | 'default' | 'outline',
  children: Node,
};

const Button = ({ theme, children, ...rest }: Props) => (
  <button className={cx('Button', theme)} {...rest}>
    {children}
  </button>
);

Button.defaultProps = {
  theme: 'default',
};

export default Button;
