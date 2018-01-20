import React from 'react';
import WriteTemplate from 'components/write/WriteTemplate';
import WriteHeader from 'components/write/WriteHeader';
import WritePanes from 'components/write/WritePanes';

const Write = () => {
  return (
    <WriteTemplate
      header={<WriteHeader />}
      panes={(
        <WritePanes
          banme="asd"
        />
      )}
    />
  );
};

export default Write;