// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';
import WriteConfigureThumbnail from 'components/write/WriteConfigureThumbnail';
import SubmitBoxAdditional from 'components/write/SubmitBoxAdditional/SubmitBoxAdditional';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions, UserActions, BaseActions, ListingActions } from 'store/actionCreators';
import type { Categories, PostData, Meta } from 'store/modules/write';
import axios from 'axios';
import storage from 'lib/storage';
import { escapeForUrl } from 'lib/common';
import { withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import WriteVisibilitySelect from 'components/write/WriteVisibilitySelect';
import WriteSeriesConfigureContainer from './WriteSeriesConfigureContainer';
import SubmitBoxSeriesContainer from './SubmitBoxSeriesContainer';

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
  username: ?string,
  urlSlug: ?string,
  isPrivate: boolean,
  seriesMode: boolean,
  seriesId: ?string,
} & ContextRouter;

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
    if (!file) return;
    if (file.size > 1024 * 1024 * 10) return;
    const fileTypeRegex = /^image\/(.*?)/;
    if (!fileTypeRegex.test(file.type)) return;
    if (file.type.indexOf('gif') > 0) return;
    // temp save post if not released
    if (!this.props.postData) {
      await WriteActions.setTempData(); // nextTick
      const { title, body, tags, categories, thumbnail, urlSlug, isPrivate, seriesId } = this.props;
      const activeCategories = (() => {
        if (!categories || categories.length === 0) return [];
        return categories.filter(c => c.active).map(c => c.id);
      })();
      try {
        await WriteActions.writePost({
          title,
          body,
          tags,
          is_temp: true,
          thumbnail,
          categories: activeCategories,
          url_slug: urlSlug || escapeForUrl(title),
          is_private: isPrivate,
          series_id: seriesId,
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (!this.props.postData) return;
    const { id } = this.props.postData;
    try {
      const filename = escapeForUrl(file.name);
      await WriteActions.createUploadUrl({ postId: id, filename });
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
      WriteActions.setThumbnail(encodeURI(`https://images.velog.io/${this.props.imagePath}`));
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
    if (tags.indexOf(processedTag) !== -1) return;
    if (processedTag.length > 25) return;
    WriteActions.insertTag(processedTag);
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
    const {
      categories,
      tags,
      body,
      title,
      postData,
      thumbnail,
      meta,
      urlSlug,
      isPrivate,
      seriesId,
    } = this.props;
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
          url_slug: urlSlug,
          is_private: isPrivate,
          series_id: seriesId,
        });
        BaseActions.showToast({
          type: 'success',
          message: '포스트가 수정됐습니다',
        });
      } else {
        await WriteActions.writePost({
          title,
          thumbnail,
          body,
          tags,
          is_temp: false,
          categories: categories ? categories.filter(c => c.active).map(c => c.id) : [],
          meta,
          url_slug: urlSlug || escapeForUrl(title),
          is_private: isPrivate,
          series_id: seriesId,
        });

        BaseActions.showToast({
          type: 'success',
          message: '포스트가 작성됐습니다',
        });
      }

      // redirect to post after success
      if (!this.props.username || !this.props.postData) return;
      const postUrl = `/@${this.props.username}/${this.props.postData &&
        this.props.postData.url_slug}`;
      ListingActions.flushList();
      setTimeout(() => {
        this.props.history.push(postUrl);
      });
    } catch (e) {
      BaseActions.showToast({
        type: 'error',
        message: '포스트 작성 실패',
      });
    }
  };

  onTempSave = async () => {
    const {
      postData,
      title,
      body,
      tags,
      categories,
      thumbnail,
      urlSlug,
      isPrivate,
      seriesId,
    } = this.props;

    const activeCategories = (() => {
      if (!categories || categories.length === 0) return [];
      return categories.filter(c => c.active).map(c => c.id);
    })();

    if (!title) {
      BaseActions.showToast({
        type: 'error',
        message: '제목을 입력해주세요',
      });
      return;
    }
    if (!body) {
      BaseActions.showToast({
        type: 'error',
        message: '내용을 입력해주세요',
      });
      return;
    }
    try {
      if (!postData) {
        await WriteActions.writePost({
          title,
          body,
          tags,
          is_temp: true,
          thumbnail,
          categories: activeCategories,
          url_slug: urlSlug || escapeForUrl(title),
          is_private: isPrivate,
          series_id: seriesId,
        });
      }
      if (postData && postData.is_temp) {
        await WriteActions.updatePost({
          id: postData.id,
          title,
          body,
          tags,
          is_temp: postData.is_temp,
          thumbnail,
          categories: activeCategories,
          url_slug: urlSlug,
          is_private: isPrivate,
          series_id: seriesId,
        });
      }
      if (this.props.postData) {
        await WriteActions.tempSave({ title, body, postId: this.props.postData.id });
      }

      BaseActions.showToast({
        type: 'success',
        message: '포스트가 임시저장 되었습니다',
      });
    } catch (e) {
      BaseActions.showToast({
        type: 'error',
        message: '임시저장 실패',
      });
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
  onChangeUrlSlug = (e: SyntheticInputEvent<HTMLInputElement>) => {
    WriteActions.changeUrlSlug(e.target.value);
  };
  onConfirmAdditionalConfig = () => {
    WriteActions.toggleAdditionalConfig();
    console.log(this.props.meta.code_theme);
    storage.set('codeTheme', this.props.meta.code_theme);
  };
  onSelectVisibility = (isPrivate: boolean) => {
    WriteActions.setVisibility(isPrivate);
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

    const {
      body,
      open,
      categories,
      tags,
      postData,
      thumbnail,
      additional,
      meta,
      username,
      urlSlug,
      isPrivate,
      seriesMode,
    } = this.props;

    const postLink = username && postData && `/@${username}/${postData.url_slug}`;

    return (
      <SubmitBox
        postLink={postLink}
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
        configureSeries={<WriteSeriesConfigureContainer />}
        visibilitySelect={
          <WriteVisibilitySelect onSelect={this.onSelectVisibility} isPrivate={isPrivate} />
        }
        visible={open}
        onClose={onClose}
        onSubmit={onSubmit}
        isEdit={!!postData && !postData.is_temp}
        onTempSave={this.onTempSave}
        onToggleAdditionalConfig={onToggleAdditionalConfig}
        additional={
          additional && (
            <SubmitBoxAdditional
              body={body}
              meta={meta}
              urlSlug={urlSlug}
              username={username || ''}
              realMeta={postData && postData.meta}
              onChangeCodeTheme={onChangeCodeTheme}
              onChangeShortDescription={onChangeShortDescription}
              onChangeUrlSlug={this.onChangeUrlSlug}
              onCancel={onCancelAdditionalConfig}
              onConfirm={onConfirmAdditionalConfig}
            />
          )
        }
        series={seriesMode && <SubmitBoxSeriesContainer />}
      />
    );
  }
}

const enhance = compose(
  connect(
    ({ write, user }: State) => ({
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
      username: user.user && user.user.username,
      urlSlug: write.submitBox.url_slug,
      isPrivate: write.submitBox.is_private,
      seriesMode: write.seriesModal.visible,
      seriesId: write.submitBox.series ? write.submitBox.series.id : null,
    }),
    () => ({}),
  ),
  withRouter,
);
export default enhance(SubmitBoxContainer);
