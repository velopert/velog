// @flow
import React, { type Node } from 'react';
import cx from 'classnames';
import './Button.scss';

type Props = {
  theme: void | 'default' | 'outline' | 'paper',
  confirm?: boolean,
  cancel?: boolean,
  violetFont?: boolean,
  className?: string,
  children: Node,
};

const Button = ({ theme, children, confirm, cancel, violetFont, className, ...rest }: Props) => (
  <button className={cx('Button', theme, className, { confirm, cancel, violetFont })} {...rest}>
    {children}
  </button>
);

Button.defaultProps = {
  theme: 'default',
  confirm: false,
  cancel: false,
  violetFont: false,
  className: '',
};

export default Button;
