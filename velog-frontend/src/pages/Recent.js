import React from 'react';
import RecentPostCards from 'containers/list/RecentPostCards';
import RecentTemplate from 'components/recent/RecentTemplate/RecentTemplate';
import { Helmet } from 'react-helmet';

type Props = {};

const Recent = (props: Props) => {
  return (
    <RecentTemplate>
      <Helmet>
        <title>최신 포스트 | velog</title>
        <meta
          name="description"
          content="벨로그에 방금 작성된 다양한 개발자들이 작성한 따끈따끈한 포스트들을 읽어보세요."
        />
      </Helmet>
      <RecentPostCards />
    </RecentTemplate>
  );
};

export default Recent;
