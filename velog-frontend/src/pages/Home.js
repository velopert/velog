import React from 'react';
import PageTemplate from 'components/templates/PageTemplate';
import HomeTemplate from 'components/templates/HomeTemplate';
import Header from 'components/base/Header';

const Home = () => {
  return (
    <PageTemplate header={<Header />}>
      <HomeTemplate />
    </PageTemplate>
  );
};

export default Home;
