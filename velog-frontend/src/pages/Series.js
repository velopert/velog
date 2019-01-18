// @flow
import React from 'react';
import { type Match } from 'react-router-dom';
import ViewerHead from 'components/base/ViewerHead';
import PlainTemplate from '../components/common/PlainTemplate';
import SeriesContainer from '../containers/series/SeriesContainer';

type Props = {
  match: Match,
};

const Series = ({ match }: Props) => {
  return (
    <PlainTemplate header={<ViewerHead />}>
      <SeriesContainer />
    </PlainTemplate>
  );
};

export default Series;
