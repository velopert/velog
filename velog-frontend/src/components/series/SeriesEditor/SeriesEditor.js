// @flow
import React, { Component } from 'react';
import { type SeriesData } from 'store/modules/series';
import TextareaAutosize from 'react-autosize-textarea';
import './SeriesEditor.scss';

type Props = {
  series: SeriesData,
};

type State = {
  name: string,
};
class SeriesEditor extends Component<Props, State> {
  state = {
    name: '',
  };

  constructor(props: Props) {
    super(props);
    this.state.name = props.series.name;
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

  render() {
    return (
      <div className="SeriesEditor">
        <TextareaAutosize
          className="title"
          onChange={this.onChangeTitle}
          value={this.state.name}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

export default SeriesEditor;
