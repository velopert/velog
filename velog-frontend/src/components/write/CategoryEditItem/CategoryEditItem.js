// @flow
import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import RemoveIcon from 'react-icons/lib/io/trash-b';
import EditIcon from 'react-icons/lib/md/edit';
import './CategoryEditItem.scss';

type Props = {
  edit?: boolean,
  name: string,
}

const defaultProps = {
  edit: false,
  name: '카테고리',
};

const DefaultItem = ({ edit, name }: Props) => {
  return (
    <Fragment>
      <div className="text">{name}</div>
      <div className="buttons">
        <div className="button edit"><EditIcon /></div>
        <div className="button remove"><RemoveIcon /></div>
      </div>
    </Fragment>
  );
};

DefaultItem.defaultProps = defaultProps;

const EditingItem = ({ edit }: Props) => {
  return (
    <Fragment>
      <input />
      <div className="apply-button">
        적용
      </div>
    </Fragment>
  );
};

EditingItem.defaultProps = defaultProps;

class CategoryEditItem extends Component<Props> {
  static defaultProps = defaultProps;
  render() {
    const { edit, name } = this.props;
    return (
      <div className={cx('CategoryEditItem', { edit })}>
        {
          edit
            ? <EditingItem {...this.props} />
            : <DefaultItem {...this.props} />
        }
      </div>
    );
  }
}

export default CategoryEditItem;