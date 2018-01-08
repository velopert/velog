import React, { Component } from 'react';
import queryString from 'query-string';

class Callback extends Component {
  initialize = () => {
    const { search } = this.props.location;
    const { provider } = this.props.params;

    const { code } = queryString(search);
    window.opener.socialAuth = {
      provider: 'github',
      code: 'code',
    };
  }

  componentDidMount() {

  }

  render() {
    return null;
  }
}

export default Callback;