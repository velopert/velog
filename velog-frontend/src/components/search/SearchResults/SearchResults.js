// @flow
import React, { Component } from 'react';
import SearchResultItem from '../SearchResultItem';

import './SearchResults.scss';

type Props = {};

class SearchResults extends Component<Props> {
  render() {
    return (
      <div className="SearchResults">
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
        <SearchResultItem />
      </div>
    );
  }
}

export default SearchResults;
