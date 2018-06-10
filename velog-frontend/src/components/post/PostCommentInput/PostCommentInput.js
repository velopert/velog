// @flow
import React, { Component } from 'react';
import './PostCommentInput.scss';

type Props = {};
type State = {
  input: string,
};

class PostCommentInput extends Component<Props, State> {
  state = {
    input: '',
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      input: e.target.value,
    });
  };

  render() {
    return (
      <div className="PostCommentInput">
        <textarea rows="4" />
      </div>
    );
  }
}

export default PostCommentInput;
