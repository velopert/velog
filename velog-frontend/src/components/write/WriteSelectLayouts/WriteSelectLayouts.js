// @flow
import React, { type Node } from 'react';
import EditorLeftPaneIcon from 'components/icons/EditorLeftPaneIcon';
import EditorRightPaneIcon from 'components/icons/EditorRightPaneIcon';
import EditorBothPanesIcon from 'components/icons/EditorBothPanesIcon';
import cx from 'classnames';

import './WriteSelectLayouts.scss';

type LayoutButtonProps = {
  children?: ?Node,
  onClick?: () => void,
  description: string,
  active?: boolean,
};

const LayoutButton = ({ children, onClick, description, active }: LayoutButtonProps) => (
  <div className={cx('layout-button', { active })} onClick={onClick}>
    {children}
    <div className="text">{description}</div>
  </div>
);

LayoutButton.defaultProps = {
  children: null,
  onClick: () => console.log('onClick not defined'),
  active: false,
};

type Props = {};

const WriteSelectLayouts = (props: Props) => (
  <div className="WriteSelectLayouts">
    <LayoutButton description="에디터만">
      <EditorLeftPaneIcon />
    </LayoutButton>
    <LayoutButton description="둘 다 보기" active>
      <EditorBothPanesIcon />
    </LayoutButton>
    <LayoutButton description="미리보기만">
      <EditorRightPaneIcon />
    </LayoutButton>
  </div>
);

export default WriteSelectLayouts;
