import React from 'react';
import WriteTemplate from 'components/write/WriteTemplate';
import WriteHeader from 'components/write/WriteHeader';
import WritePanes from 'components/write/WritePanes';
import CodeEditorContainer from 'containers/write/CodeEditorContainer';
import WriteHeaderContainer from 'containers/write/WriteHeaderContainer';
import MarkdownPreviewContainer from 'containers/write/MarkdownPreviewContainer';
import SubmitBox from 'components/write/SubmitBox';


const Write = () => {
  return (
    <WriteTemplate
      header={<WriteHeaderContainer />}
    >
      <SubmitBox />
      <WritePanes
        left={
          <CodeEditorContainer />
        }
        right={
          <MarkdownPreviewContainer />
        }
      />
    </WriteTemplate>
  );
};

export default Write;