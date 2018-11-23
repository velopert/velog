// @flow
import React from 'react';
import { type ContextRouter } from 'react-router-dom';
import queryString from 'query-string';
import SuccessInfo from '../components/etc/SuccessInfo/SuccessInfo';

type Props = {} & ContextRouter;

const Success = (props: Props) => {
  const query = queryString.parse(props.location.search);
  const { message, type } = query;

  return <SuccessInfo message={message} type={type} />;
};

export default Success;
