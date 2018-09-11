// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import WriteHeader from 'components/write/WriteHeader/WriteHeader';
import type { PostData, Category } from 'store/modules/write';
import { Prompt, withRouter, type ContextRouter } from 'react-router-dom';
import { compose } from 'redux';
import Blocker from 'components/common/Blocker';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import { escapeForUrl } from 'lib/common';
import axios from 'axios';

type Props = {
  title: string,
  body: string,
  tags: string[],
  thumbnail: ?string,
  categories: ?(Category[]),
  postData: ?PostData,
  writeExtraOpen: boolean,
  changed: boolean,
  uploadUrl: ?string,
  imagePath: ?string,
} & ContextRouter;

class WriteHeaderContainer extends Component<Props> {
  timer = null;

  loadPost = (id: string) => {
    WriteActions.getPostById(id);
  };

  componentDidMount() {
    this.timer = setInterval(this.autoTempSave, 30000);
    // reads edit_id
    const query = queryString.parse(this.props.location.search);
    if (query.edit_id) {
      this.loadPost(query.edit_id);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  autoTempSave = () => {
    const { postData, changed } = this.props;
    if (!postData || !changed) return;
    this.onTempSave();
  };

  onChangeTitle = (e) => {
    const { value } = e.target;
    WriteActions.editField({
      field: 'title',
      value,
    });
  };

  onOpenSubmitBox = () => {
    WriteActions.openSubmitBox();
  };

  onCloseSubmitBox = () => {
    WriteActions.closeSubmitBox();
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

  // TODO: make this to HOC!!!!!!!!!!!!!!!!
  // may be 6 months later?
  uploadImage = async (file: any) => {
    WriteActions.setUploadMask(false);
    if (!file) return;
    if (file.size > 1024 * 1024 * 10) return;
    const fileTypeRegex = /^image\/(.*?)/;
    if (!fileTypeRegex.test(file.type)) return;

    if (!this.props.postData) {
      await WriteActions.setTempData();
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
          categories: activeCategories,
          thumbnail,
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (!this.props.postData) return;
    const { id } = this.props.postData;
    const data = new FormData();
    if (!file) return;
    const filename = escapeForUrl(file.name);
    await WriteActions.createUploadUrl({ postId: id, filename });
    try {
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
      const imageUrl = `${'\n'}![${file.name}](https://images.velog.io/${
        this.props.imagePath
      })${'\n'}`;
      WriteActions.setInsertText(imageUrl);
      WriteActions.setUploadStatus(false);
    } catch (e) {
      WriteActions.setUploadStatus(false);
      console.log(e);
    }
  };

  onTempSave = async () => {
    const { postData, title, body, tags, categories, thumbnail } = this.props;

    const activeCategories = (() => {
      if (!categories || categories.length === 0) return [];
      return categories.filter(c => c.active).map(c => c.id);
    })();

    try {
      if (!postData) {
        await WriteActions.writePost({
          title,
          body,
          tags,
          isMarkdown: true,
          isTemp: true,
          thumbnail,
          categories: activeCategories,
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
        });
      }
      if (this.props.postData) {
        await WriteActions.tempSave({ title, body, postId: this.props.postData.id });
      }
    } catch (e) {
      console.log(e);
    }
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  onShowWriteExtra = () => {
    WriteActions.showWriteExtra();
  };

  onHideWriteExtra = () => {
    WriteActions.hideWriteExtra();
  };

  render() {
    const { onChangeTitle, onOpenSubmitBox, onTempSave, onShowWriteExtra, onHideWriteExtra } = this;
    const { title, postData, writeExtraOpen, changed } = this.props;
    return (
      <Fragment>
        {title && (
          <Helmet>
            <title>{`(작성중) ${title} | velog`}</title>
          </Helmet>
        )}
        <WriteHeader
          onOpenSubmitBox={onOpenSubmitBox}
          onChangeTitle={onChangeTitle}
          onUploadClick={this.onUploadClick}
          onShowWriteExtra={onShowWriteExtra}
          onHideWriteExtra={onHideWriteExtra}
          title={title}
          isEdit={!!postData && !postData.is_temp}
          writeExtraOpen={writeExtraOpen}
          onGoBack={this.onGoBack}
        />
        <Prompt
          when={changed}
          message={() => '작성중이던 포스트가 있습니다. 정말로 나가시겠습니까?'}
        />
        {changed && <Blocker />}
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ write }: State) => ({
      title: write.title,
      body: write.body,
      postData: write.postData,
      categories: write.submitBox.categories,
      tags: write.submitBox.tags,
      writeExtraOpen: write.writeExtra.visible,
      thumbnail: write.thumbnail,
      changed: write.changed,
      uploadUrl: write.upload.uploadUrl,
      imagePath: write.upload.imagePath,
    }),
    () => ({}),
  ),
)(WriteHeaderContainer);
