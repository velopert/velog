// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { type State } from 'store';
import SearchResults from 'components/search/SearchResults';
import type { PostItem } from 'store/modules/listing';

type Props = {
  result: ?{
    count: number,
    data: PostItem[],
  },
};

class SearchResultsContainer extends Component<Props> {
  render() {
    return <SearchResults result={this.props.result} hasNext />;
  }
}

export default connect(
  (state: State) => ({
    result: state.search.result,
  }),
  () => ({}),
)(SearchResultsContainer);
