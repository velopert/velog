// @flow
import React, { Component } from 'react';
import './MainSidebar.scss';

type Props = {};

class MainSidebar extends Component<Props> {
  render() {
    return (
      <aside className="MainSidebar">
        <div className="logo">velog</div>
      </aside>
    );
  }
}

export default MainSidebar;
