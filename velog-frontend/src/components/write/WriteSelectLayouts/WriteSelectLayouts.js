// @flow
import React, { type Node } from 'react';
import EditorLeftPaneIcon from 'components/icons/EditorLeftPaneIcon';
import EditorRightPaneIcon from 'components/icons/EditorRightPaneIcon';
import EditorBothPanesIcon from 'components/icons/EditorBothPanesIcon';
import cx from 'classnames';

import './WriteSelectLayouts.scss';

type LayoutButtonProps = {
  children?: ?Node,
  onClick(mode: string): void,
  description: string,
  activeMode: string,
  mode: string,
};

const LayoutButton = ({ children, onClick, description, activeMode, mode }: LayoutButtonProps) => (
  <button
    className={cx('layout-button', { active: activeMode === mode })}
    onClick={() => onClick(mode)}
  >
    {children}
    <div className="text">{description}</div>
  </button>
);

LayoutButton.defaultProps = {
  children: null,
  onClick: () => console.log('onClick not defined'),
  active: false,
};

type Props = {
  mode: string,
  onSelect(mode: string): void,
};

const WriteSelectLayouts = ({ onSelect, mode }: Props) => (
  <div className="WriteSelectLayouts">
    <LayoutButton description="에디터만" mode="editor" activeMode={mode} onClick={onSelect}>
      <EditorLeftPaneIcon />
    </LayoutButton>
    <LayoutButton description="둘 다 보기" mode="both" activeMode={mode} onClick={onSelect}>
      <EditorBothPanesIcon />
    </LayoutButton>
    <LayoutButton description="미리보기만" mode="preview" activeMode={mode} onClick={onSelect}>
      <EditorRightPaneIcon />
    </LayoutButton>
  </div>
);

export default WriteSelectLayouts;
