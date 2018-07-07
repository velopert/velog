// @flow
import React from 'react';
import TagsTemplate from 'components/tags/TagsTemplate';
import TagsTab from 'components/tags/TagsTab/TagsTab';
import { type ContextRouter } from 'react-router-dom';
import queryString from 'query-string';
import TagItemListContainer from 'containers/tags/TagItemListContainer';

type Props = {} & ContextRouter;

const Tags = ({ location }: Props) => {
  const { sort } = queryString.parse(location.search);
  return (
    <TagsTemplate>
      <TagsTab sort={sort} />
      <TagItemListContainer sort={sort} />
    </TagsTemplate>
  );
};

export default Tags;
