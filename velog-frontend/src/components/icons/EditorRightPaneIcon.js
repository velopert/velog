// @flow
import React from 'react';
import IconBase from 'react-icon-base';

const EditorRightPaneIcon = (props: any) => {
  return (
    <IconBase viewBox="0 0 64 64" {...props}>
      <defs>
        <rect id="rightpane-path1" x="0" y="0" width="20" height="40" rx="2" />
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="RightPaneIcon">
          <g id="Panes" transform="translate(6.000000, 12.000000)">
            <rect id="Rectangle" fill="#FFFFFF" x="32" y="0" width="20" height="40" rx="2" />
            <g id="Rectangle">
              <use
                fillOpacity="0.25"
                fill="#FFFFFF"
                fillRule="evenodd"
                xlinkHref="#rightpane-path1"
              />
              <rect
                strokeOpacity="0.15"
                stroke="#FFFFFF"
                strokeWidth="1"
                x="0.5"
                y="0.5"
                width="19"
                height="39"
                rx="2"
              />
            </g>
          </g>
        </g>
      </g>
    </IconBase>
  );
};

export default EditorRightPaneIcon;
