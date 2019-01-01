// @flow
import React, { Component, Fragment } from 'react';
import { escapeForUrl } from 'lib/common';
import cn from 'classnames';
import { type SeriesItemData } from 'store/modules/write';
import './SubmitBoxSeries.scss';
import Button from '../../common/Button/Button';

type Props = {
  onCreateSeries: (payload: { name: string, urlSlug: string }) => any,
  list: ?(SeriesItemData[]),
};
type State = {
  cancelling: boolean,
  editing: boolean,
  name: string,
  urlSlug: string,
};
class SubmitBoxSeries extends Component<Props, State> {
  input = React.createRef();
  timeoutId: ?any = null;

  state = {
    cancelling: false,
    editing: false,
    name: '',
    urlSlug: '',
  };

  onStartEditing = () => {
    this.setState({
      editing: true,
    });
  };

  onCancelEditing = () => {
    this.setState({
      cancelling: true,
    });
    this.timeoutId = setTimeout(() => {
      this.setState({ editing: false }, () => {
        this.setState({
          cancelling: false,
        });
      });
    }, 150);
  };

  onCreateSeries = () => {
    const { name, urlSlug } = this.state;
    this.props.onCreateSeries({
      name,
      urlSlug,
    });
    this.onCancelEditing();
  };

  onUrlWrapperClick = () => {
    if (!this.input.current) return;
    this.input.current.focus();
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.name !== this.state.name) {
      this.setState({
        urlSlug: escapeForUrl(this.state.name),
      });
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    const { name, urlSlug, editing, cancelling } = this.state;
    const { list } = this.props;

    return (
      <div className="SubmitBoxSeries">
        <h3>시리즈 설정</h3>
        <div className="list-wrapper">
          <div className={cn('create-form', { editing, cancelling })}>
            <input
              className="regular"
              placeholder="새로운 시리즈 이름을 입력하세요."
              onChange={this.onChange}
              onFocus={this.onStartEditing}
              name="name"
              value={name}
            />
            {editing && (
              <div className={cn('editing', { cancelling })}>
                <div className="url-wrapper" onClick={this.onUrlWrapperClick}>
                  <div className="text">/@velopert/series/</div>
                  <input name="urlSlug" ref={this.input} onChange={this.onChange} value={urlSlug} />
                </div>
                <div className="buttons">
                  <Button cancel onClick={this.onCancelEditing}>
                    취소
                  </Button>
                  <Button onClick={this.onCreateSeries}>추가</Button>
                </div>
              </div>
            )}
          </div>
          <div className="list">
            {list &&
              list.map(item => (
                <div className="item" key={item.id}>
                  {item.name}
                </div>
              ))}
          </div>
        </div>
        <Button large fullWidth className="select">
          선택
        </Button>
      </div>
    );
  }
}

export default SubmitBoxSeries;
