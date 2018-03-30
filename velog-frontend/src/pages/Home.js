import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import LandingTemplateContainer from 'containers/landing/LandingTemplateContainer';
import HeaderContainer from 'containers/base/HeaderContainer';
import AuthFormContainer from 'containers/landing/AuthFormContainer';
import Main from 'containers/main/Main';

const Home = () => {
  return (
    <PageTemplate header={<HeaderContainer />}>
      <LandingTemplateContainer
        form={<AuthFormContainer />}
      />
      <Main />
    </PageTemplate>
  );
};

export default Home;
