// @flow
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import Button from 'components/common/Button';
import './PostCommentInput.scss';

type Props = {
  showCancel?: boolean,
  onCancel?: () => any,
};
type State = {
  input: string,
  focused: boolean,
};

class PostCommentInput extends Component<Props, State> {
  static defaultProps = {
    showCancel: false,
    onCancel: () => null,
  };

  state = {
    input: '',
    focused: false,
  };

  onFocus = () => {
    this.setState({
      focused: true,
    });
  };

  onBlur = () => {
    this.setState({
      focused: false,
    });
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      input: e.target.value,
    });
  };

  render() {
    const { showCancel, onCancel } = this.props;
    const { focused, input } = this.state;

    return (
      <div className="PostCommentInput">
        <TextareaAutosize
          rows={focused || input !== '' ? 4 : 1}
          maxRows={20}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          value={input}
        />
        <div className="button-wrapper">
          <Button>댓글 작성</Button>
          {showCancel && (
            <Button cancel onClick={onCancel}>
              취소
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default PostCommentInput;
