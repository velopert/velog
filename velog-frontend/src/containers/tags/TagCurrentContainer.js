// @flow
import React, { Component } from 'react';
import { CommonActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import TagCurrent from 'components/tags/TagCurrent/TagCurrent';
import { type TagData } from 'store/modules/common';

type OwnProps = {
  tag: string,
  lastSort: string,
};

type Props = OwnProps & {
  selected: ?TagData,
};

class TagCurrentContainer extends Component<Props> {
  initialize = () => {
    const { tag } = this.props;
    return CommonActions.getTagInfo(tag);
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tag !== this.props.tag) {
      this.initialize();
    }
  }

  componentWillUnmount() {
    CommonActions.setTagInfo(null);
  }
  render() {
    const { tag, selected, lastSort } = this.props;
    return (
      <TagCurrent
        lastSort={lastSort}
        name={selected ? selected.name : tag}
        count={selected && selected.posts_count}
      />
    );
  }
}

export default connect(
  ({ common }: State) => ({
    selected: common.tags.selected,
    lastSort: common.tags.sort,
  }),
  () => ({}),
)(TagCurrentContainer);
