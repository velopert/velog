// @flow
import React, { Component } from 'react';
import uniqBy from 'lodash/uniqBy';
import RemoveIcon from 'react-icons/lib/md/remove-circle';
import type { List } from 'immutable';
import PerfectScrollbar from 'perfect-scrollbar';
import './InputTags.scss';

type Props = {
  tags: List<string>,
  onInsert(string): void,
  onRemove(string): void,
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

const Tag = ({ name, onRemove }) => (
  <div className="tag">
    <div className="text">{name}</div>
    <div className="remove" onClick={() => onRemove(name)}>
      <RemoveIcon />
    </div>
  </div>
);

class InputTags extends Component<Props, State> {
  tags: any = null;

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

  onKeyUp = (e: any) => {
    if (['Enter', ','].indexOf(e.key) !== -1) {
      this.onButtonClick();
      e.preventDefault();
    }
  }

  onButtonClick = () => {
    const { input } = this.state;
    const { onInsert } = this.props;
    onInsert(input.replace(',', ''));
    this.setState({
      input: '',
    });
  }

  renderTags() {
    const { tags, onRemove } = this.props;
    return tags.map(tag => (<Tag key={tag} name={tag} onRemove={onRemove} />));
  }

  componentDidMount() {
    const ps = new PerfectScrollbar(this.tags);
  }

  render() {
    const { onChange, onButtonClick, onKeyUp } = this;
    const { input } = this.state;

    return (
      <div className="InputTags">
        <div className="input-button">
          <input placeholder="태그를 입력하세요" value={input} onChange={onChange} onKeyUp={onKeyUp} />
          <div className="button util flex-center" onClick={onButtonClick}>등록</div>
        </div>
        <div id="tags" className="tags" ref={(ref) => { this.tags = ref; }}>
          {this.renderTags()}
        </div>
      </div>
    );
  }
}

export default InputTags;