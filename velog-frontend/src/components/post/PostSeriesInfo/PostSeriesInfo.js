// @flow
import React, { Component } from 'react';
import BookIcon from 'react-icons/lib/md/book';
import LeftIcon from 'react-icons/lib/md/chevron-left';
import RightIcon from 'react-icons/lib/md/chevron-right';
import DropDownIcon from 'react-icons/lib/md/arrow-drop-down';
import DropUpIcon from 'react-icons/lib/md/arrow-drop-up';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import './PostSeriesInfo.scss';

type SquareProps = {
  to?: string | null,
  mode: 'left' | 'right',
};

const Square = ({ to, mode }: SquareProps) => {
  const disabled = !to;
  const icon = mode === 'left' ? <LeftIcon /> : <RightIcon />;
  return disabled ? (
    <div className="square disabled">{icon}</div>
  ) : (
    <Link className="square" to={to || '/'}>
      {icon}
    </Link>
  );
};

Square.defaultProps = {
  to: '/',
};

type Props = {
  username: string,
  series: {
    description: string,
    id: string,
    index: number,
    length: number,
    url_slug: string,
    thumbnail: ?string,
    name: string,
    list: { index: number, id: string, title: string, url_slug: string }[],
  },
};

type State = {
  open: boolean,
};
class PostSeriesInfo extends Component<Props, State> {
  state = {
    open: false,
  };

  onToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  render() {
    const { series, username } = this.props;
    const { name, index, length, list } = series;
    const { open } = this.state;

    return (
      <div className="PostSeriesInfo">
        <div className="top-wrapper">
          <div className="label">
            <BookIcon />
            <span>SERIES</span>
          </div>
          <div className="number">
            {index}/{length}
          </div>
        </div>
        <h2>
          <Link to={`/@${username}/series/${series.url_slug}`}>{this.props.series.name}</Link>
        </h2>
        {open && (
          <ol>
            {list.map(item => (
              <li>
                <Link to={`/@${username}/${item.url_slug}`}>{item.title}</Link>
              </li>
            ))}
          </ol>
        )}
        <div className="footer">
          <div className="show-all" onClick={this.onToggle}>
            {open ? <DropUpIcon /> : <DropDownIcon />}
            목록보기
          </div>
          <div className="controls">
            <Square
              mode="left"
              to={index === 1 ? null : `/@${username}/${list[index - 2].url_slug}`}
            />
            <Square
              mode="right"
              to={index === length ? null : `/@${username}/${list[index].url_slug}`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PostSeriesInfo;
