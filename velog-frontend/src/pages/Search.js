// @flow
import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import SearchResultsContainer from 'containers/search/SearchResultsContainer';
import WhiteHeader from '../containers/base/WhiteHeader';
import SearchTemplate from '../components/search/SearchTemplate';
import SearchBoxContainer from '../containers/search/SearchBoxContainer';

const Search = () => {
  return (
    <PageTemplate header={<WhiteHeader />}>
      <SearchTemplate searchBox={<SearchBoxContainer />}>
        <SearchResultsContainer />
      </SearchTemplate>
    </PageTemplate>
  );
};

export default Search;
