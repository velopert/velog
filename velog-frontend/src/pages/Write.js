import React from 'react';
import WriteTemplate from 'components/write/WriteTemplate';
import WriteHeader from 'components/write/WriteHeader';
import WritePanes from 'components/write/WritePanes';
import CodeEditor from 'components/write/CodeEditor/CodeEditor';

const Write = () => {
  return (
    <WriteTemplate
      header={<WriteHeader />}
      panes={(
        <WritePanes
          left={
            <CodeEditor />
          }
          right="alaram"
        />
      )}
    />
  );
};

export default Write;