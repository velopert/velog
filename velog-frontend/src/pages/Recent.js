import React from 'react';
import RecentPostCards from 'containers/recent/RecentPostCards';
import RecentTemplate from 'components/recent/RecentTemplate/RecentTemplate';

type Props = {};

const Recent = (props: Props) => {
  return (
    <RecentTemplate>
      <RecentPostCards />
    </RecentTemplate>
  );
};

export default Recent;
