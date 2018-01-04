import React from 'react';
import PageTemplate from 'components/templates/PageTemplate';
import LandingTemplateContainer from 'containers/landing/LandingTemplateContainer';
import Header from 'components/base/Header';
import AuthFormContainer from 'containers/landing/AuthFormContainer';

const Home = () => {
  return (
    <PageTemplate header={<Header />}>
      <LandingTemplateContainer
        form={<AuthFormContainer />}
      />
    </PageTemplate>
  );
};

export default Home;
