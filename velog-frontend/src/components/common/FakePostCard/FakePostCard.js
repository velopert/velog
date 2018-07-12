// @flow
import React from 'react';
import ImageIcon from 'react-icons/lib/io/image';
import placeholder from 'static/images/post_placeholder.png';
import cx from 'classnames';

import './FakePostCard.scss';
import Postpone from '../Postpone/Postpone';

type GrayBoxProps = {
  min: number,
  max: number,
};

class GrayBox extends React.Component<GrayBoxProps> {
  size: number = 1;
  static defaultProps = {
    min: 1,
    max: 6,
  };

  constructor(props) {
    super(props);
    const { max, min } = this.props;
    this.size = min + Math.random() * (max - min);
  }
  render() {
    return <div className="gray-box keyframes blink" style={{ width: `${this.size}rem` }} />;
  }
}

type GrayBoxesProps = {
  count: number,
  min?: number,
  max?: number,
};

const GrayBoxes = ({ count, min, max }: GrayBoxesProps) => {
  const array = Array.from(Array(count).keys());
  return array.map(num => <GrayBox key={num} min={min} max={max} />);
};

type Props = {
  oneColumn?: boolean,
};

const FakePostCard = ({ oneColumn }: Props) => (
  <Postpone duration={100}>
    <div className={cx('PostCard FakePostCard', { 'one-column': oneColumn })}>
      <div className="thumbnail-wrapper">
        <img src={placeholder} alt="thumbnail" />
      </div>
      <div className="card-content">
        {!oneColumn && <div className="user-thumbnail-wrapper " />}
        <div className="content-head">
          <div className="username">
            <GrayBox min={6} max={8} />
          </div>
          <h3>
            <GrayBoxes count={7} />
          </h3>
          <div className="subinfo">
            <GrayBox min={4} max={4} />
            <GrayBox min={5} max={5} />
          </div>
        </div>
        <div className="description">
          <GrayBoxes count={15} />
        </div>
      </div>
    </div>
  </Postpone>
);

FakePostCard.defaultProps = {
  oneColumn: false,
};

export default FakePostCard;
