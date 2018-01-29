import React from 'react';
import WriteTemplate from 'components/write/WriteTemplate';
import WriteHeader from 'components/write/WriteHeader';
import WritePanes from 'components/write/WritePanes';
import CodeEditorContainer from 'containers/write/CodeEditorContainer';
import WriteHeaderContainer from 'containers/write/WriteHeaderContainer';
import MarkdownPreviewContainer from 'containers/write/MarkdownPreviewContainer';


const Write = () => {
  return (
    <WriteTemplate
      header={<WriteHeaderContainer />}
      panes={(
        <WritePanes
          left={
            <CodeEditorContainer />
          }
          right={
            <MarkdownPreviewContainer />
          }
        />
      )}
    />
  );
};

export default Write;