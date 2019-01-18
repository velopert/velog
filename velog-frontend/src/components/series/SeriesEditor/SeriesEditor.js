// @flow
import React, { Component } from 'react';
import { type SeriesData, type SeriesPostData } from 'store/modules/series';
import TextareaAutosize from 'react-autosize-textarea';
import Button from 'components/common/Button';
import { fromNow } from 'lib/common';
import Sortable from 'sortablejs';

import './SeriesEditor.scss';

type Props = {
  series: SeriesData,
  onCancel: () => void,
  onUpdate: (data: { name: string, posts: any[] }) => Promise<any>,
};

type State = {
  name: string,
  tempPosts: SeriesPostData[],
};
class SeriesEditor extends Component<Props, State> {
  sortable: any = null;
  list = React.createRef();

  state = {
    name: '',
    tempPosts: [],
  };

  constructor(props: Props) {
    super(props);
    this.state.name = props.series.name;
    this.state.tempPosts = props.series.posts;
  }

  onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  onChangeTitle = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      name: e.target.value,
    });
  };

  onSave = () => {
    const converted = this.state.tempPosts.map((tp, i) => ({
      id: tp.id,
      index: i + 1,
    }));
    this.props.onUpdate({
      name: this.state.name,
      posts: converted,
    });
  };

  reorder = (oldIndex: number, newIndex: number) => {
    const nextPosts = [...this.state.tempPosts];
    const temp = nextPosts[oldIndex];
    nextPosts.splice(oldIndex, 1);
    nextPosts.splice(newIndex, 0, temp);
    this.setState({
      tempPosts: nextPosts,
    });
  };

  initialize = () => {
    this.sortable = Sortable.create(this.list.current, {
      animation: 150,
      chosenClass: 'chosen',
      ghostClass: 'ghost',
      dragClass: 'drag',
      onUpdate: (e: any) => {
        const { oldIndex, newIndex } = e;
        this.reorder(oldIndex, newIndex);
      },
    });
    window.sortable = this.sortable;
  };
  componentDidMount() {
    this.initialize();
  }

  render() {
    const { onCancel } = this.props;
    return (
      <div className="SeriesEditor">
        <TextareaAutosize
          className="title"
          onChange={this.onChangeTitle}
          value={this.state.name}
          onKeyPress={this.onKeyPress}
        />
        <div className="buttons-wrapper">
          <Button cancel onClick={onCancel}>
            취소
          </Button>
          <Button onClick={this.onSave}>적용</Button>
        </div>
        <div className="list" ref={this.list}>
          {this.state.tempPosts.map(post => (
            <div className="item" key={post.id}>
              <div className="post-title">{post.title}</div>
              <div className="post-date">{fromNow(post.released_at)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default SeriesEditor;
