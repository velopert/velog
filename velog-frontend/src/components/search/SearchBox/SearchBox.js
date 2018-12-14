// @flow
import React, { Component } from 'react';
import SearchIcon from 'react-icons/lib/io/ios-search';
import debounce from 'lodash/debounce';
import { withRouter, type ContextRouter } from 'react-router-dom';
import queryString from 'query-string';

import './SearchBox.scss';

type Props = {
  onSearch(keyword: string): any,
} & ContextRouter;

type State = { value: string };
class SearchBox extends Component<Props, State> {
  input = React.createRef();
  state = {
    value: '',
  };

  constructor(props: Props) {
    super(props);
    const { q } = queryString.parse(this.props.location.search);
    if (q) {
      this.state.value = q;
    }
  }

  componentDidMount() {
    const { value } = this.state;
    if (value) {
      this.onSearch();
    }
  }

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
      const input = this.input.current;
      if (!input) return;
      input.blur();
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
          autoFocus
          type="search"
          ref={this.input}
        />
      </div>
    );
  }
}

export default withRouter(SearchBox);
