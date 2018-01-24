import React from 'react';
import WriteTemplate from 'components/write/WriteTemplate';
import WriteHeader from 'components/write/WriteHeader';
import WritePanes from 'components/write/WritePanes';
import CodeEditorContainer from 'containers/write/CodeEditorContainer';


const Write = () => {
  return (
    <WriteTemplate
      header={<WriteHeader />}
      panes={(
        <WritePanes
          left={
            <CodeEditorContainer />
          }
          right="alaram"
        />
      )}
    />
  );
};

export default Write;