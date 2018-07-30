// @flow
import React, { Fragment } from 'react';
import TagsTemplate from 'components/tags/TagsTemplate';
import TagsTab from 'components/tags/TagsTab/TagsTab';
import { type ContextRouter } from 'react-router-dom';
import queryString from 'query-string';
import TagItemListContainer from 'containers/tags/TagItemListContainer';
import TagCurrentContainer from 'containers/tags/TagCurrentContainer';
import TagPostCards from 'containers/list/TagPostCards';
import { Helmet } from 'react-helmet';

type Props = {} & ContextRouter;

const Tags = ({ location, match, history }: Props) => {
  const { sort } = queryString.parse(location.search);
  const { tag } = match.params;

  return (
    <TagsTemplate>
      {tag ? (
        <Helmet>
          <title>{`#${tag} | velog`}</title>
          <meta
            name="description"
            content={`벨로그에 작성된 #${tag} 태그를 가지고 있는 포스트들을 모아보세요.`}
          />
        </Helmet>
      ) : (
        <Helmet>
          <title>태그 목록 | velog</title>
          <meta
            name="description"
            content="벨로그에 작성된 다양한 포스트들을 태그별로 분류해서 읽어보세요."
          />
        </Helmet>
      )}
      {tag ? (
        <Fragment>
          <TagCurrentContainer tag={tag} />
          <TagPostCards />
        </Fragment>
      ) : (
        <Fragment>
          <TagsTab sort={sort} />
          <TagItemListContainer sort={sort} />
        </Fragment>
      )}
    </TagsTemplate>
  );
};

export default Tags;
