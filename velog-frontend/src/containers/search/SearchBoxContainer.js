// @flow
import React, { Component } from 'react';
import SearchBox from 'components/search/SearchBox';
import { SearchActions } from 'store/actionCreators';

type Props = {};
class SearchBoxContainer extends Component<Props> {
  onSearch = (keyword: string) => {
    if (!keyword) return null;
    return SearchActions.publicSearch({
      q: keyword,
    });
  };
  render() {
    return <SearchBox onSearch={this.onSearch} />;
  }
}

export default SearchBoxContainer;
