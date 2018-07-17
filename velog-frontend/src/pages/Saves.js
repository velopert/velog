// @flow
import React from 'react';
import SavesTemplate from 'components/saves/SavesTemplate';
import ViewerHead from 'components/base/ViewerHead';
import RightCorner from 'containers/base/RightCorner';
import SavePostCardListContainer from 'containers/saves/SavePostCardListContainer';

type Props = {};

const Saves = (props: Props) => {
  return (
    <SavesTemplate header={<ViewerHead rightCorner={<RightCorner />} />}>
      <SavePostCardListContainer />
    </SavesTemplate>
  );
};

export default Saves;
