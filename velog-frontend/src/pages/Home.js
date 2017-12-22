import React from 'react';
import PageTemplate from 'components/templates/PageTemplate';
import HomeTemplate from 'components/templates/HomeTemplate';
import Header from 'components/base/Header';
import AuthFormContainer from 'containers/home/AuthFormContainer';

const Home = () => {
  return (
    <PageTemplate header={<Header />}>
      <HomeTemplate
        form={<AuthFormContainer />}
      />
    </PageTemplate>
  );
};

export default Home;
