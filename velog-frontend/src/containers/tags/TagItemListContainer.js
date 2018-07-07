// @flow
import React, { Component } from 'react';
import { CommonActions } from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import { type TagData } from 'store/modules/common';
import TagItemList from 'components/tags/TagItemList/TagItemList';

type OwnProps = {
  sort: string,
};

type Props = OwnProps & {
  tags: ?(TagData[]),
};

class TagItemListContainer extends Component<Props> {
  initialize = () => {
    const { sort } = this.props;
    CommonActions.getTags(sort);
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sort !== this.props.sort) {
      this.initialize();
    }
  }

  render() {
    const { tags } = this.props;
    return <TagItemList tags={tags} />;
  }
}

export default connect(
  ({ common }: State) => ({
    tags: common.tags.data,
  }),
  () => ({}),
)(TagItemListContainer);
