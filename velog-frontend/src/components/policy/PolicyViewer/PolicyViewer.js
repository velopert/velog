// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { Helmet } from 'react-helmet';
import policyData from '../policyData';

import './PolicyViewer.scss';
import MarkdownRender from '../../common/MarkdownRender/MarkdownRender';

type Props = {
  mode: string,
};

const PolicyViewer = ({ mode }: Props) => {
  const title = mode === 'privacy' ? '개인정보 취급 방침' : '이용약관';

  return (
    <div className="PolicyViewer">
      <Helmet>
        <title>{`${title} | velog`}</title>
        <meta name="description" content={`벨로그 서비스의 ${title}을 볼 수 있는 페이지 입니다.`} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="links">
        <Link to="/policy" className={cx({ active: mode === 'privacy' })}>
          개인정보 취급 방침
        </Link>
        <Link to="/policy/terms" className={cx({ active: mode === 'terms' })}>
          이용약관
        </Link>
      </div>
      <MarkdownRender body={policyData[mode]} />
    </div>
  );
};

export default PolicyViewer;
