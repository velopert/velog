import React from 'react';
import PageTemplate from 'components/templates/PageTemplate';
import LandingTemplateContainer from 'containers/landing/LandingTemplateContainer';
import HeaderContainer from 'containers/base/HeaderContainer';
import AuthFormContainer from 'containers/landing/AuthFormContainer';

const Home = () => {
  return (
    <PageTemplate header={<HeaderContainer />}>
      <LandingTemplateContainer
        form={<AuthFormContainer />}
      />
    </PageTemplate>
  );
};

export default Home;
