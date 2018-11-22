// @flow
import React from 'react';
import ErrorInfo from 'components/etc/ErrorInfo/ErrorInfo';
import { Helmet } from 'react-helmet';
import { type ContextRouter } from 'react-router-dom';
import qs from 'query-string';
import RespStatus from '../../components/etc/RespStatus';

type Props = {} & ContextRouter;
const CustomError = ({ location }: Props) => {
  const query = qs.parse(location.search);
  const { code = 400, message = '잘못된 요청입니다' } = query;

  return (
    <RespStatus code={code}>
      <Helmet>
        <title>Oops!</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ErrorInfo code={code} message={message} />
    </RespStatus>
  );
};

export default CustomError;
