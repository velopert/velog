// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions, UserActions } from 'store/actionCreators';
import type { Categories } from 'store/modules/write';
import type { List } from 'immutable';

type Props = {
  open: boolean,
  categories: ?Categories,
  tags: List<string>,
  title: string,
  body: string,
}

class SubmitBoxContainer extends Component<Props> {
  initialize = async () => {
    try {
      await WriteActions.listCategories();
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    this.initialize();
  }
  onInsertTag = (tag) => {
    const { tags } = this.props;
    const processedTag = tag.trim();
    if (processedTag === '') return;
    if (tags.indexOf(tag) !== -1) return;
    WriteActions.insertTag(tag);
  }
  onRemoveTag = (tag) => {
    WriteActions.removeTag(tag);
  }
  onClose = () => {
    WriteActions.closeSubmitBox();
  }
  onToggleCategory = (id) => {
    WriteActions.toggleCategory(id);
  }
  onEditCategoryClick = () => {
    WriteActions.openCategoryModal();
    WriteActions.closeSubmitBox();
  }
  onSubmit = async () => {
    const { categories, tags, body, title } = this.props;

    // console.log({
    //   title,
    //   body,
    //   categories: categories ? categories.filter(c => c.active).map(c => c.id).toJS() : [],
    //   tags: tags.toJS(),
    // });
    try {
      await WriteActions.writePost({
        title,
        body,
        isMarkdown: true,
        isTemp: false,
        tags: tags.toJS(),
        categories: categories ? categories.filter(c => c.active).map(c => c.id).toJS() : [],
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const {
      onClose, onToggleCategory, onInsertTag,
      onRemoveTag, onSubmit, onEditCategoryClick,
    } = this;
    const { open, categories, tags } = this.props;
    return (
      <SubmitBox
        onEditCategoryClick={onEditCategoryClick}
        selectCategory={<SelectCategory categories={categories} onToggle={onToggleCategory} />}
        inputTags={(
          <InputTags
            tags={tags}
            onInsert={onInsertTag}
            onRemove={onRemoveTag}
          />
        )}
        visible={open}
        onClose={onClose}
        onSubmit={onSubmit}
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
  }),
  () => ({}),
)(SubmitBoxContainer);
