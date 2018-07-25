// @flow
import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import './Button.scss';

type Props = {
  theme: void | 'default' | 'outline' | 'paper' | 'gray' | 'transparent',
  confirm?: boolean,
  cancel?: boolean,
  violetFont?: boolean,
  className?: string,
  to?: ?string,
  children: Node,
  large?: boolean,
  fullWidth?: boolean,
};

const Button = ({
  theme,
  children,
  confirm,
  cancel,
  violetFont,
  className,
  to,
  large,
  fullWidth,
  ...rest
}: Props) => {
  const processedClassName = cx('Button', theme, className, {
    confirm,
    cancel,
    violetFont,
    large,
    fullWidth,
  });
  if (to) {
    return (
      <Link className={processedClassName} to={to} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={processedClassName} {...rest}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  theme: 'default',
  confirm: false,
  cancel: false,
  violetFont: false,
  className: '',
  to: null,
  large: false,
  fullWidth: false,
};

export default Button;
