// @flow
import React, { Component, Fragment } from 'react';
import SearchBox from 'components/search/SearchBox';
import { SearchActions } from 'store/actionCreators';
import { type State } from 'store';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

type Props = {
  currentKeyword: ?string,
};
class SearchBoxContainer extends Component<Props> {
  onSearch = (keyword: string) => {
    if (this.props.currentKeyword === keyword) return null;
    if (!keyword) {
      SearchActions.initialize();
      return null;
    }
    SearchActions.initialize();
    return SearchActions.publicSearch({
      q: keyword,
    });
  };
  render() {
    const { currentKeyword } = this.props;
    const title = currentKeyword ? `${currentKeyword} | velog 검색` : 'velog 검색';
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <SearchBox onSearch={this.onSearch} />
      </Fragment>
    );
  }
}

export default connect((state: State) => ({
  currentKeyword: state.search.currentKeyword,
}))(SearchBoxContainer);
