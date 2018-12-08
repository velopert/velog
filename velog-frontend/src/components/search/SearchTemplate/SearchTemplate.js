// @flow
import React, { type Node } from 'react';
import './SearchTemplate.scss';

type Props = {
  searchBox: Node,
  children: Node,
};

const SearchTemplate = ({ children, searchBox }: Props) => {
  return (
    <div className="SearchTemplate">
      <div className="search-box-area">{searchBox}</div>
      <div className="contents">{children}</div>
    </div>
  );
};

export default SearchTemplate;
