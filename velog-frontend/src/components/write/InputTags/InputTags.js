// @flow
import React, { Component } from 'react';
import uniqBy from 'lodash/uniqBy';
import RemoveIcon from 'react-icons/lib/md/remove-circle';
import './InputTags.scss';

type Props = {
  tags: Array<string>
};

type State = {
  input: string
};

// const processTags = (tags: Array<string>): Array<string> => {
//   let processed = tags.map(tag => tag.trim()) // trim the text
//     .filter(tag => tag !== ''); // remove empty ones
//   processed = uniqBy(tags); // remove duplicates;
//   return processed;
// };

const Tag = ({ name }) => (
  <div className="tag">
    <div className="text">{name}</div>
    <div className="remove">
      <RemoveIcon />
    </div>
  </div>
);

class InputTags extends Component<Props, State> {
  static defaultProps = {
    tags: ['태그1', '태그2', '태그3'],
  };

  state = {
    input: '',
  }

  onChange = (e: any) => {
    this.setState({
      input: e.target.value,
    });
  }

  onKeyPress = (e: any) => {
    if (['Enter', ','].indexOf(e.key) !== -1) {
      this.onButtonClick();
      e.preventDefault();
    }
  }

  onButtonClick = () => {
    // const { input } = this.state;
    this.setState({
      input: '',
    });
  }

  renderTags() {
    const { tags } = this.props;
    return tags.map(tag => (<Tag key={tag} name={tag} />));
  }

  render() {
    const { onChange, onButtonClick, onKeyPress } = this;
    const { input } = this.state;

    return (
      <div className="InputTags">
        <div className="input-button">
          <input placeholder="태그를 입력하세요" value={input} onChange={onChange} onKeyPress={onKeyPress} />
          <div className="button util flex-center" onClick={onButtonClick}>등록</div>
        </div>
        <div className="tags">
          {this.renderTags()}
        </div>
      </div>
    );
  }
}

export default InputTags;