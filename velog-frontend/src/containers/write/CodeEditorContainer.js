// @flow

import React, { Component, Fragment } from 'react';
import CodeEditor from 'components/write/CodeEditor/CodeEditor';
import FloatingImageButton from 'components/write/FloatingImageButton';
import { connect } from 'react-redux';
import type { State } from 'store';
import { WriteActions } from 'store/actionCreators';
import DropImage from 'components/write/DropImage';
import WriteUploadMask from 'components/write/WriteUploadMask';
import axios from 'axios';
import type { PostData, Category } from 'store/modules/write';

type Props = {
  title: string,
  body: string,
  mask: boolean,
  postData: ?PostData,
  tags: string[],
  categories: ?(Category[]),
  postData: ?PostData,
  insertText: ?string,
  uploadUrl: ?string,
  imagePath: ?string,
  uploadId: ?string,
  thumbnail: ?string,
  categoryModalOpen: boolean,
};

class CodeEditorContainer extends Component<Props> {
  onEditBody = (value) => {
    WriteActions.editField({
      field: 'body',
      value,
    });
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

  onDragEnter = (e) => {
    e.preventDefault();
    if (this.props.categoryModalOpen) return;
    console.log(e);
    setImmediate(() => {
      WriteActions.setUploadMask(true);
    });
  };

  onDragLeave = (e) => {
    e.preventDefault();
    if (!e.relatedTarget) WriteActions.setUploadMask(false);
  };

  onPasteImage = (file) => {
    if (!file) return;
    this.uploadImage(file);
  };

  uploadImage = async (file: any) => {
    WriteActions.setUploadMask(false);
    // temp save post if there isn't one.
    // uploading needs postId
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
    await WriteActions.createUploadUrl({ postId: id, filename: file.name });
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

  onClearInsertText = () => {
    WriteActions.setInsertText(null);
  };
  onDrop = (e: any) => {
    e.preventDefault();
    if (this.props.categoryModalOpen) return;
    // TODO: Some other browsers use 'items'
    const { /* items, */ files } = e.dataTransfer;
    if (!files) return;
    this.uploadImage(files[0]);
    // if (files) {
    //   const filesArray = [...files];
    //   const data = new FormData();
    //   data.append('image', files[0]);
    //   data.append('post_id', 'ff04fa20-3f2b-11e8-adb7-5344ec582abb');
    //   axios.post('/files/upload', data, {
    //     onUploadProgress: (uploadEvent) => {
    //       console.log(`${uploadEvent.loaded}/${uploadEvent.total}`);
    //     },
    //   });
    // }
  };

  componentWillUnmount() {}

  render() {
    const { onEditBody, onDragEnter, onDragLeave, onDrop, onClearInsertText, onPasteImage } = this;
    const { body, mask, insertText } = this.props;

    return (
      <Fragment>
        <CodeEditor
          onEditBody={onEditBody}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onClearInsertText={onClearInsertText}
          body={body}
          insertText={insertText}
          imageButton={<FloatingImageButton onClick={this.onUploadClick} />}
        />
        <DropImage
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onPaste={onPasteImage}
        />
        <WriteUploadMask visible={mask} />
      </Fragment>
    );
  }
}

export default connect(
  ({ write }: State) => ({
    title: write.title,
    body: write.body,
    postData: write.postData,
    categories: write.submitBox.categories,
    tags: write.submitBox.tags,
    mask: write.upload.mask,
    insertText: write.insertText,
    uploadUrl: write.upload.uploadUrl,
    imagePath: write.upload.imagePath,
    uploadId: write.upload.id,
    thumbnail: write.thumbnail,
    categoryModalOpen: write.categoryModal.open,
  }),
  () => ({}),
)(CodeEditorContainer);
