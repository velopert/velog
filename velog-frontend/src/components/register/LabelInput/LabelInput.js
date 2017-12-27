// @flow
import React from 'react';
import cx from 'classnames';
import LockIcon from 'react-icons/lib/md/lock-outline';

import './LabelInput.scss';

type Props = {
  label: string,
  value?: string,
  disabled?: boolean,
  required?: boolean,
  limit: ?number,
};

const LabelInput = ({ label, value, limit, required, disabled, ...rest }: Props) => {
  return (
    <div className={cx('register label-input', { disabled })}>
      <div className="label">{label} {required && <span>*</span>}</div>
      <input value={value} {...rest} disabled={disabled} />
      { disabled && (
        <div className="lock-wrapper">
          <div className="lock">
            <LockIcon />
          </div>
        </div>
      )
      }
      { limit && (
        <div className="limit">
          { !value ? 0 : value.length } / {limit}
        </div>
      )}
    </div>
  );
};

LabelInput.defaultProps = {
  value: '',
  disabled: false,
  required: false,
  limit: null,
};

export default LabelInput;
