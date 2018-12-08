// @flow
import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import WhiteHeader from '../containers/base/WhiteHeader';
import SearchTemplate from '../components/search/SearchTemplate';
import SearchBox from '../components/search/SearchBox';

const Search = () => {
  return (
    <PageTemplate header={<WhiteHeader />}>
      <SearchTemplate searchBox={<SearchBox />}>asdf</SearchTemplate>
    </PageTemplate>
  );
};

export default Search;
