// @flow
import React, { Component } from 'react';
import type { PostItem } from 'store/modules/listing';
import SearchResultItem from '../SearchResultItem';

import './SearchResults.scss';
import Button from '../../common/Button/Button';

type Props = {
  result: ?{
    count: number,
    data: PostItem[],
  },
  hasNext: boolean,
};

class SearchResults extends Component<Props> {
  renderList() {
    const { result } = this.props;
    if (!result) return null;
    return result.data.map(post => <SearchResultItem post={post} key={post.id} />);
  }
  render() {
    return (
      <div className="SearchResults">
        {this.renderList()}
        {this.props.hasNext && (
          <Button fullWidth large theme="transparent" className="more-btn">
            109개의 검색결과 더보기
          </Button>
        )}
      </div>
    );
  }
}

export default SearchResults;
