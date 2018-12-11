// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { type State } from 'store';
import SearchResults from 'components/search/SearchResults';
import type { PostItem } from 'store/modules/listing';
import { SearchActions } from 'store/actionCreators';

type Props = {
  result: ?{
    count: number,
    data: PostItem[],
  },
  currentKeyword: string,
  currentPage: number,
  pending: boolean,
};

class SearchResultsContainer extends Component<Props> {
  onSearchNext = () => {
    const { currentKeyword, currentPage, pending } = this.props;
    if (pending) return;
    SearchActions.nextPublicSearch({
      q: currentKeyword,
      page: currentPage + 1,
    });
  };
  render() {
    return <SearchResults result={this.props.result} onSearchNext={this.onSearchNext} />;
  }
}

export default connect(
  (state: State) => ({
    result: state.search.result,
    currentKeyword: state.search.currentKeyword,
    currentPage: state.search.currentPage,
    pending:
      state.pender.pending['search/NEXT_PUBLIC_SEARCH'] ||
      state.pender.pending['search/PUBLIC_SEARCH'],
  }),
  () => ({}),
)(SearchResultsContainer);
