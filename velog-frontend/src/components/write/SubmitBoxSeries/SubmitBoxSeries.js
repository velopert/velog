// @flow
import React, { Component, Fragment } from 'react';
import { escapeForUrl } from 'lib/common';
import cn from 'classnames';
import { type SeriesItemData } from 'store/modules/write';
import './SubmitBoxSeries.scss';
import Button from '../../common/Button/Button';

type Props = {
  onClose: () => void,
  onCreateSeries: (payload: { name: string, urlSlug: string }) => any,
  onSelectSeries: (index: number) => void,
  list: ?(SeriesItemData[]),
  series: ?{ id: string, name: string },
};
type State = {
  cancelling: boolean,
  editing: boolean,
  name: string,
  urlSlug: string,
  selectedIndex: number,
};
class SubmitBoxSeries extends Component<Props, State> {
  input = React.createRef();
  timeoutId: ?any = null;

  state = {
    cancelling: false,
    editing: false,
    name: '',
    urlSlug: '',
    selectedIndex: -1,
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

  onCreateSeries = async () => {
    const { name, urlSlug } = this.state;
    await this.props.onCreateSeries({
      name,
      urlSlug,
    });
    this.setState({
      name: '',
      urlSlug: '',
      selectedIndex: 0,
    });
    this.onCancelEditing();
  };

  onSelectSeries = () => {
    const { selectedIndex } = this.state;
    this.props.onSelectSeries(selectedIndex);
  };

  onUrlWrapperClick = () => {
    if (!this.input.current) return;
    this.input.current.focus();
  };

  autoSelect = () => {
    const { series, list } = this.props;
    if (!series || !list) return;
    const index = list.findIndex(s => s.id === series.id);
    this.setState({
      selectedIndex: index,
    });
  };

  componentDidMount() {
    this.autoSelect();
  }

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };

  onClick = (index: number) => {
    this.setState({
      selectedIndex: index,
    });
  };

  onRemoveSeries = () => {
    this.props.onSelectSeries(-1);
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.name !== this.state.name) {
      this.setState({
        urlSlug: escapeForUrl(this.state.name),
      });
    }

    if (this.props.series && this.props.list !== prevProps.list) {
      this.autoSelect();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    const { name, urlSlug, editing, cancelling } = this.state;
    const { list, series } = this.props;

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
              list.map((item, index) => (
                <div
                  className={cn('item', { active: index === this.state.selectedIndex })}
                  key={item.id}
                  onClick={() => this.onClick(index)}
                >
                  {item.name}
                </div>
              ))}
          </div>
        </div>
        {series ? (
          <Button large theme="outline" fullWidth className="remove" onClick={this.onRemoveSeries}>
            시리즈에서 제거
          </Button>
        ) : (
          <Button large theme="outline" className="close" fullWidth onClick={this.props.onClose}>
            취소
          </Button>
        )}
        <Button large fullWidth className="select" onClick={this.onSelectSeries}>
          선택
        </Button>
      </div>
    );
  }
}

export default SubmitBoxSeries;
