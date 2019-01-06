// @flow
import React, { Component } from 'react';
import BookIcon from 'react-icons/lib/md/book';
import LeftIcon from 'react-icons/lib/md/chevron-left';
import RightIcon from 'react-icons/lib/md/chevron-right';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import './PostSeriesInfo.scss';

type SquareProps = {
  disabled: boolean,
  to?: string,
  mode: 'left' | 'right',
};

const Square = ({ disabled, to, mode }: SquareProps) => {
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
  series: {
    description: string,
    id: string,
    index: number,
    length: number,
    url_slug: string,
    thumbnail: ?string,
    name: string,
    list: { index: number, id: string, title: string, url_slug: string },
  },
};

class PostSeriesInfo extends Component<Props> {
  render() {
    const { series } = this.props;
    const { name, index, length } = series;

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
        <h2>{this.props.series.name}</h2>
        <div className="footer">
          <div className="show-all">목록보기</div>
          <div className="controls">
            <Square mode="left" disabled={index === 0} />
            <Square mode="right" disabled={index === length} />
          </div>
        </div>
      </div>
    );
  }
}

export default PostSeriesInfo;
