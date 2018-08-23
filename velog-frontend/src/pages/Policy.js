import React from 'react';
import PolicyViewer from 'components/policy/PolicyViewer';
import PageTemplate from 'components/base/PageTemplate';
import WhiteHeader from '../containers/base/WhiteHeader';

const Policy = ({ match }) => {
  return (
    <PageTemplate header={<WhiteHeader />}>
      <PolicyViewer mode={match.params.mode || 'privacy'} />
    </PageTemplate>
  );
};

export default Policy;
