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
  onSearchNext: () => any,
};

class SearchResults extends Component<Props> {
  renderList() {
    const { result } = this.props;
    if (!result) return null;
    return result.data.map(post => <SearchResultItem post={post} key={post.id} />);
  }
  render() {
    const { result, onSearchNext } = this.props;
    if (!result) return null;
    return (
      <div className="SearchResults">
        <div className="count">
          총 <b>{result.count}개</b>의 포스트를 찾았습니다.
        </div>
        {this.renderList()}
        {result.count > result.data.length && (
          <Button fullWidth large theme="transparent" className="more-btn" onClick={onSearchNext}>
            {result.count - result.data.length}개의 검색결과 더보기
          </Button>
        )}
      </div>
    );
  }
}

export default SearchResults;
