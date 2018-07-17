// @flow
import React, { Component } from 'react';
import * as actions from 'store/actionCreators';
import type { State } from 'store';
import { connect } from 'react-redux';
import SavePostCardList from 'components/saves/SavePostCardList/SavePostCardList';

type Props = {};

class SavePostCardListContainer extends Component<Props> {
  render() {
    return <SavePostCardList />;
  }
}

export default connect((state: State) => ({}), () => ({}))(SavePostCardListContainer);
