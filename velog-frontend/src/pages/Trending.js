import React from 'react';
import TrendingTemplate from 'components/trending/TrendingTemplate';
import TrandingSection from 'components/trending/TrandingSection';
import PostCardList from '../components/common/PostCardList/PostCardList';

type Props = {};

const Trending = (props: Props) => {
  return (
    <TrendingTemplate>
      <TrandingSection title="지금 뜨고 있는 포스트">
        <PostCardList />
      </TrandingSection>
    </TrendingTemplate>
  );
};

export default Trending;
