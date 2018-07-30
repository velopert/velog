import React from 'react';
import TrendingTemplate from 'components/trending/TrendingTemplate';
import TrandingSection from 'components/trending/TrandingSection';
import { Helmet } from 'react-helmet';
import PostCardList from '../components/common/PostCardList/PostCardList';
import TrendingPostCards from '../containers/list/TrendingPostCards';

type Props = {};

const Trending = (props: Props) => {
  return (
    <TrendingTemplate>
      <Helmet>
        <title>지금 뜨고 있는 포스트 | velog</title>
        <meta
          name="description"
          content="지금 벨로그에서 뜨고있는 다양한 포스트를 확인하세요. 실시간으로 벨로그에서 인기있는 포스트들을 읽을 수 있습니다."
        />
      </Helmet>
      <TrandingSection title="지금 뜨고 있는 포스트">
        <TrendingPostCards />
      </TrandingSection>
    </TrendingTemplate>
  );
};

export default Trending;
