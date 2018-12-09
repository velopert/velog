// @flow
import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import WhiteHeader from '../containers/base/WhiteHeader';
import SearchTemplate from '../components/search/SearchTemplate';
import SearchBoxContainer from '../containers/search/SearchBoxContainer';
import SearchResults from '../components/search/SearchResults/index';

const Search = () => {
  return (
    <PageTemplate header={<WhiteHeader />}>
      <SearchTemplate searchBox={<SearchBoxContainer />}>
        <SearchResults />
      </SearchTemplate>
    </PageTemplate>
  );
};

export default Search;
