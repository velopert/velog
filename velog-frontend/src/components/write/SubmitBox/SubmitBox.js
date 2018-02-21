// @flow
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import SettingsIcon from 'react-icons/lib/md/settings';
import cx from 'classnames';

import './SubmitBox.scss';

type Props = {
  isEditing: boolean,
  selectCategory: any,
  inputTags: any,
  visible: boolean,
  onClose(): void,
  onSubmit(): void,
};

type State = {
  animating: boolean,
};

class SubmitBox extends Component<Props, State> {
  animateTimeout: any;

  static defaultProps = {
    isEditing: false,
  }

  state = {
    animating: false,
  }

  handleClickOutside = () => {
    const { onClose } = this.props;
    onClose();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this.animate();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animateTimeout);
  }

  animate = () => {
    clearTimeout(this.animateTimeout);
    this.setState({
      animating: true,
    });
    this.animateTimeout = setTimeout(() => {
      this.setState({
        animating: false,
      });
    }, 150);
  }

  render() {
    const { isEditing, selectCategory, inputTags, visible, onSubmit } = this.props;
    const { animating } = this.state;

    if (!visible && !animating) return null;

    return (
      <div className={cx('SubmitBox', visible ? 'appear' : 'disappear')}>
        <div className="title">
          {isEditing ? '수정하기' : '새 글 작성하기'}
        </div>
        <div className="sections">
          <section>
            <div className="section-title category">
              카테고리 선택
              <div className="edit util flex-center">
                <SettingsIcon />
                <div>수정</div>
              </div>
            </div>
            {selectCategory}
          </section>
          <section>
            <div className="section-title">
              태그 설정
            </div>
            {inputTags}
          </section>
        </div>
        <div className="footer">
          <div className="open-options">
            <span>추가설정</span>
          </div>
          <div className="submit-button util flex-center" onClick={onSubmit}>작성하기</div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(SubmitBox);