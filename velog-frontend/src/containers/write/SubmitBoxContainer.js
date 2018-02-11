// @flow

import React, { Component } from 'react';
import SubmitBox from 'components/write/SubmitBox';
import SelectCategory from 'components/write/SelectCategory';
import InputTags from 'components/write/InputTags';

type Props = {}

class SubmitBoxContainer extends Component<Props> {
  render() {
    return (
      <SubmitBox
        selectCategory={<SelectCategory />}
        inputTags={<InputTags tags={['나의숲으로', '가자']} />}
      />
    );
  }
}

export default SubmitBoxContainer;