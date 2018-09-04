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
  shouldCancel: boolean,
};

class TagItemListContainer extends Component<Props> {
  initialize = () => {
    const { sort, shouldCancel } = this.props;
    if (shouldCancel) return;
    CommonActions.getTags(sort);
  };

  componentDidMount() {
    this.initialize();
  }

  onSelectTag = (info: TagData) => {
    CommonActions.setTagInfo(info);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.sort !== this.props.sort) {
      this.initialize();
    }
  }

  render() {
    const { tags } = this.props;
    return <TagItemList tags={tags} onSelectTag={this.onSelectTag} />;
  }
}

export default connect(
  ({ common }: State) => ({
    tags: common.tags.data,
    shouldCancel: common.ssr && !common.router.altered,
  }),
  () => ({}),
)(TagItemListContainer);
