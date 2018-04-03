// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import MarkdownRender from 'components/common/MarkdownRender';
import './PostContent.scss';

type Props = { }

const sampleMarkdown = `
## 잔인한 너는 멀어져가겠지

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## 이런건가

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### 궁시렁

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### 어쩌고

\`\`\`javascript
console.log('say hi!');

\`\`\`
`;

const PostContent = (props: Props) => (
  <div className="PostContent">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
      <polygon points="0 0, 100 0, 0 10" fill="#ffffff" />
    </svg>
    <div className="wrapper">
      <Responsive className="floating-box">
        <MarkdownRender body={sampleMarkdown} />
      </Responsive>
    </div>
  </div>
);

export default PostContent;