// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import AlphabeticalIcon from 'react-icons/lib/md/sort-by-alpha';
import HotIcon from 'react-icons/lib/md/whatshot';
import cx from 'classnames';
import './TagsTab.scss';

type Props = {
  sort: ?string,
};

const TagsTab = ({ sort }: Props) => (
  <div className="TagsTab">
    <Link className={cx({ active: sort === 'popular' })} to="/tags?sort=popular">
      <HotIcon />인기순
    </Link>
    <Link className={cx({ active: sort === 'name' })} to="/tags?sort=name">
      <AlphabeticalIcon />이름순
    </Link>
  </div>
);

TagsTab.defaultProps = {
  sort: 'popular',
};

export default TagsTab;
