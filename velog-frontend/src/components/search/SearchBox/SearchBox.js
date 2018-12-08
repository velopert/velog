// @flow
import React, { Component } from 'react';
import SearchIcon from 'react-icons/lib/io/ios-search';
import './SearchBox.scss';

type Props = {};
type State = {};
class SearchBox extends Component<Props, State> {
  render() {
    return (
      <div className="SearchBox">
        <SearchIcon />
        <input placeholder="찾고싶은 검색어를 입력하세요." />
      </div>
    );
  }
}

export default SearchBox;
