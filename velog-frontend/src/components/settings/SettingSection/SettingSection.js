// @flow
import React, { type Node } from 'react';
import './SettingSection.scss';

type Props = {
  children: Node,
  name: string,
};

const SettingSection = ({ children, name }: Props) => (
  <section className="SettingSection">
    <h4>{name}</h4>
    <div className="section-contents">{children}</div>
  </section>
);

export default SettingSection;
