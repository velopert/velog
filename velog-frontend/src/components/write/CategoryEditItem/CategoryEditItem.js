// @flow
import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import RemoveIcon from 'react-icons/lib/io/trash-b';
import EditIcon from 'react-icons/lib/md/edit';
import './CategoryEditItem.scss';

type Props = {
  edit?: boolean,
  name: string,
  temp?: boolean,
  onToggleEditCategory(): void,
  onChange(e: SyntheticInputEvent<HTMLInputElement>): any,
  onHide(): void,
};

const defaultProps = {
  edit: false,
  temp: false,
  name: '카테고리',
};

const DefaultItem = ({ name, onHide, onToggleEditCategory }: Props) => {
  return (
    <Fragment>
      <div className="text">{name}</div>
      <div className="buttons">
        <div className="button edit" onClick={onToggleEditCategory}>
          <EditIcon />
        </div>
        <div className="button remove" onClick={onHide}>
          <RemoveIcon />
        </div>
      </div>
    </Fragment>
  );
};

DefaultItem.defaultProps = defaultProps;

const EditingItem = ({ edit, temp, name, onToggleEditCategory, onChange }: Props) => {
  return (
    <Fragment>
      <input placeholder="새 카테고리" autoFocus onChange={onChange} value={name} />
      <div className="apply-button" onClick={onToggleEditCategory}>
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
        {edit ? <EditingItem {...this.props} /> : <DefaultItem {...this.props} />}
      </div>
    );
  }
}

export default CategoryEditItem;
