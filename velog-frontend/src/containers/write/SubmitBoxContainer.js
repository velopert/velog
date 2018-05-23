// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import WriteConfigureThumbnail from 'components/write/WriteConfigureThumbnail';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions, UserActions } from 'store/actionCreators';
import type { Categories, PostData } from 'store/modules/write';

type Props = {
  open: boolean,
  categories: ?Categories,
  tags: string[],
  title: string,
  body: string,
  postData: ?PostData,
};

class SubmitBoxContainer extends Component<Props> {
  initialize = async () => {
    try {
      await WriteActions.listCategories();
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    this.initialize();
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) {
      this.initialize();
    }
  }

  onInsertTag = (tag) => {
    const { tags } = this.props;
    const processedTag = tag.trim();
    if (processedTag === '') return;
    if (tags.indexOf(tag) !== -1) return;
    WriteActions.insertTag(tag);
  };
  onRemoveTag = (tag) => {
    WriteActions.removeTag(tag);
  };
  onClose = () => {
    WriteActions.closeSubmitBox();
  };
  onToggleCategory = (id) => {
    WriteActions.toggleCategory(id);
  };
  onEditCategoryClick = () => {
    WriteActions.openCategoryModal();
    WriteActions.closeSubmitBox();
  };
  onSubmit = async () => {
    const { categories, tags, body, title, postData } = this.props;

    try {
      if (postData) {
        // update if the post alreadyy exists
        await WriteActions.updatePost({
          id: postData.id,
          title,
          body,
          tags,
          is_temp: false,
          categories: categories ? categories.filter(c => c.active).map(c => c.id) : [],
        });
      } else {
        await WriteActions.writePost({
          title,
          body,
          tags,
          isMarkdown: true,
          isTemp: false,
          categories: categories ? categories.filter(c => c.active).map(c => c.id) : [],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {
      onClose,
      onToggleCategory,
      onInsertTag,
      onRemoveTag,
      onSubmit,
      onEditCategoryClick,
    } = this;
    const { open, categories, tags, postData } = this.props;
    return (
      <SubmitBox
        onEditCategoryClick={onEditCategoryClick}
        selectCategory={<SelectCategory categories={categories} onToggle={onToggleCategory} />}
        inputTags={<InputTags tags={tags} onInsert={onInsertTag} onRemove={onRemoveTag} />}
        configureThumbnail={<WriteConfigureThumbnail />}
        visible={open}
        onClose={onClose}
        onSubmit={onSubmit}
        isEdit={!!postData}
      />
    );
  }
}

export default connect(
  ({ write }: State) => ({
    open: write.submitBox.open,
    categories: write.submitBox.categories,
    tags: write.submitBox.tags,
    body: write.body,
    title: write.title,
    postData: write.postData,
  }),
  () => ({}),
)(SubmitBoxContainer);
