// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import WriteConfigureThumbnail from 'components/write/WriteConfigureThumbnail';
import SubmitBoxAdditional from 'components/write/SubmitBoxAdditional/SubmitBoxAdditional';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions, UserActions } from 'store/actionCreators';
import type { Categories, PostData, Meta } from 'store/modules/write';
import axios from 'axios';
import storage from 'lib/storage';

type Props = {
  open: boolean,
  categories: ?Categories,
  tags: string[],
  title: string,
  body: string,
  postData: ?PostData,
  uploadUrl: ?string,
  imagePath: ?string,
  uploadId: ?string,
  thumbnail: ?string,
  additional: boolean,
  meta: Meta,
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
    const savedCodeTheme = storage.get('codeTheme');

    if (savedCodeTheme) {
      WriteActions.setMetaValue({ name: 'code_theme', value: savedCodeTheme });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) {
      this.initialize();
    }
  }

  uploadImage = async (file: any) => {
    // temp save post if not released
    if (!this.props.postData) {
      await WriteActions.setTempData(); // nextTick
      const { title, body, tags, categories, thumbnail } = this.props;
      const activeCategories = (() => {
        if (!categories || categories.length === 0) return [];
        return categories.filter(c => c.active).map(c => c.id);
      })();
      try {
        await WriteActions.writePost({
          title,
          body,
          tags,
          isMarkdown: true,
          isTemp: true,
          thumbnail,
          categories: activeCategories,
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (!this.props.postData) return;
    const { id } = this.props.postData;
    try {
      await WriteActions.createUploadUrl({ postId: id, filename: file.name });
      WriteActions.setUploadStatus(true);
      if (!this.props.uploadUrl) return;
      await axios.put(this.props.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        withCredentials: false,
        onUploadProgress: (e) => {
          if (window.nanobar) {
            window.nanobar.go(e.loaded / e.total * 100);
          }
        },
      });
      if (!this.props.imagePath) return;
      WriteActions.setThumbnail(`https://images.velog.io/${this.props.imagePath}`);
    } catch (e) {
      console.log(e);
    }
    WriteActions.setUploadStatus(false);
  };

  onClearThumbnail = () => {
    WriteActions.setThumbnail(null);
  };
  onUploadClick = () => {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.onchange = (e) => {
      if (!upload.files) return;
      const file = upload.files[0];
      this.uploadImage(file);
    };
    upload.click();
  };

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
    // WriteActions.resetMeta();
  };
  onToggleCategory = (id) => {
    WriteActions.toggleCategory(id);
  };
  onEditCategoryClick = () => {
    WriteActions.openCategoryModal();
    WriteActions.closeSubmitBox();
  };
  onSubmit = async () => {
    const { categories, tags, body, title, postData, thumbnail, meta } = this.props;

    try {
      if (postData) {
        // update if the post alreadyy exists
        await WriteActions.updatePost({
          id: postData.id,
          thumbnail,
          title,
          body,
          tags,
          is_temp: false,
          categories: categories ? categories.filter(c => c.active).map(c => c.id) : [],
          meta,
        });
      } else {
        await WriteActions.writePost({
          title,
          thumbnail,
          body,
          tags,
          isMarkdown: true,
          isTemp: false,
          categories: categories ? categories.filter(c => c.active).map(c => c.id) : [],
          meta,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  onToggleAdditionalConfig = () => {
    WriteActions.toggleAdditionalConfig();
  };
  onCancelAdditionalConfig = () => {
    WriteActions.toggleAdditionalConfig();
    WriteActions.resetMeta();
  };
  onChangeShortDescription = (e: SyntheticInputEvent<HTMLInputElement>) => {
    WriteActions.setMetaValue({ name: 'short_description', value: e.target.value });
  };
  onChangeCodeTheme = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    WriteActions.setMetaValue({ name: 'code_theme', value: e.target.value });
  };
  onConfirmAdditionalConfig = () => {
    WriteActions.toggleAdditionalConfig();
    console.log(this.props.meta.code_theme);
    storage.set('codeTheme', this.props.meta.code_theme);
  };

  render() {
    const {
      onClose,
      onToggleCategory,
      onInsertTag,
      onRemoveTag,
      onSubmit,
      onEditCategoryClick,
      onUploadClick,
      onClearThumbnail,
      onToggleAdditionalConfig,
      onChangeShortDescription,
      onChangeCodeTheme,
      onCancelAdditionalConfig,
      onConfirmAdditionalConfig,
    } = this;
    const { body, open, categories, tags, postData, thumbnail, additional, meta } = this.props;
    return (
      <SubmitBox
        onEditCategoryClick={onEditCategoryClick}
        selectCategory={<SelectCategory categories={categories} onToggle={onToggleCategory} />}
        inputTags={<InputTags tags={tags} onInsert={onInsertTag} onRemove={onRemoveTag} />}
        configureThumbnail={
          <WriteConfigureThumbnail
            thumbnail={thumbnail}
            onUploadClick={onUploadClick}
            onClearThumbnail={onClearThumbnail}
          />
        }
        visible={open}
        onClose={onClose}
        onSubmit={onSubmit}
        isEdit={!!postData && !postData.is_temp}
        onToggleAdditionalConfig={onToggleAdditionalConfig}
        additional={
          additional && (
            <SubmitBoxAdditional
              body={body}
              meta={meta}
              realMeta={postData && postData.meta}
              onChangeCodeTheme={onChangeCodeTheme}
              onChangeShortDescription={onChangeShortDescription}
              onCancel={onCancelAdditionalConfig}
              onConfirm={onConfirmAdditionalConfig}
            />
          )
        }
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
    uploadUrl: write.upload.uploadUrl,
    imagePath: write.upload.imagePath,
    uploadId: write.upload.id,
    thumbnail: write.thumbnail,
    additional: write.submitBox.additional,
    meta: write.meta,
  }),
  () => ({}),
)(SubmitBoxContainer);
