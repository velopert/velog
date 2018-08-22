// @flow
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import Button from 'components/common/Button';
import './PostCommentInput.scss';

type Props = {
  showCancel?: boolean,
  replyTo?: ?string,
  onCancel?: () => any,
  onWriteComment: (text: string, replyTo?: ?string) => Promise<*>,
  editing?: ?boolean,
  defaultValue?: string,
};
type State = {
  input: string,
  focused: boolean,
  waiting: boolean,
};

class PostCommentInput extends Component<Props, State> {
  static defaultProps = {
    showCancel: false,
    onCancel: () => null,
    defaultValue: '',
  };

  state = {
    input: '',
    focused: false,
    waiting: false,
  };

  constructor(props: Props) {
    super(props);
    if (props.defaultValue) {
      this.state.input = props.defaultValue;
    }
  }

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

  onWriteButtonClick = async () => {
    const { onWriteComment, replyTo } = this.props;
    const { input } = this.state;
    try {
      this.setState({
        input: '',
      });
      if (this.props.onCancel) {
        this.props.onCancel();
      }
      await onWriteComment(input, replyTo);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { showCancel, onCancel, editing } = this.props;
    const { focused, input, waiting } = this.state;

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
          <Button disabled={waiting} onClick={this.onWriteButtonClick}>
            {editing ? '수정하기' : '댓글 작성'}
          </Button>
          {showCancel && (
            <Button cancel onMouseDown={onCancel}>
              취소
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default PostCommentInput;
