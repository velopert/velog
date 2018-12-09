// @flow
import React, { Component } from 'react';
import SearchIcon from 'react-icons/lib/io/ios-search';
import debounce from 'lodash/debounce';
import './SearchBox.scss';

type Props = {
  onSearch(keyword: string): any,
};
type State = { value: string };
class SearchBox extends Component<Props, State> {
  state = {
    value: '',
  };

  onSearch = () => {
    const { value } = this.state;
    this.props.onSearch(value);
  };

  debouncedSearch = debounce(this.onSearch, 500);

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState(
      {
        value: e.target.value,
      },
      () => {
        this.debouncedSearch();
      },
    );
  };

  onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.onSearch();
    }
  };
  render() {
    const { value } = this.state;
    return (
      <div className="SearchBox">
        <SearchIcon />
        <input
          placeholder="찾고싶은 검색어를 입력하세요."
          value={value}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

export default SearchBox;
