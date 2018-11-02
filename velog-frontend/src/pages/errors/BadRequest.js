// @flow
import React from 'react';
import ErrorInfo from 'components/etc/ErrorInfo/ErrorInfo';
import { Helmet } from 'react-helmet';
import RespStatus from '../../components/etc/RespStatus';

const BadRequest = () => {
  return (
    <RespStatus code={404}>
      <Helmet>
        <title>Oops!</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ErrorInfo code="400" message="잘못된 요청입니다." />
    </RespStatus>
  );
};

export default BadRequest;
