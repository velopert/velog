// @flow
import React, { type Node } from 'react';
import cx from 'classnames';
import './Button.scss';

type Props = {
  theme: void | 'default' | 'outline' | 'paper',
  confirm?: boolean,
  cancel?: boolean,
  violetFont?: boolean,
  children: Node,
};

const Button = ({ theme, children, confirm, cancel, violetFont, ...rest }: Props) => (
  <button className={cx('Button', theme, { confirm, cancel, violetFont })} {...rest}>
    {children}
  </button>
);

Button.defaultProps = {
  theme: 'default',
  confirm: false,
  cancel: false,
  violetFont: false,
};

export default Button;
