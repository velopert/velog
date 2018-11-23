// @flow
import React, { Component } from 'react';
import { certifyEmail } from 'lib/api/auth';
import queryString from 'query-string';
import ErrorInfo from 'components/etc/ErrorInfo/ErrorInfo';
import { type ContextRouter } from 'react-router-dom';
import SuccessInfo from '../../components/etc/SuccessInfo/SuccessInfo';

type ErrorData = {
  code: number,
  message: string,
};

type Props = {} & ContextRouter;
type State = {
  processed: boolean,
  error: ?ErrorData,
};

class EmailCertifyContainer extends Component<Props, State> {
  state = {
    processed: false,
    error: null,
  };

  initialize = async () => {
    const query = queryString.parse(this.props.location.search);
    const { code } = query;
    if (!code) {
      this.setState({
        error: {
          code: 400,
          message: '잘못된 요청입니다.',
        },
      });
      return;
    }
    try {
      await certifyEmail(code);
      this.setState({ processed: true });
    } catch (e) {
      if (!(e && e.response)) {
        this.setState({
          error: {
            code: 400,
            message: '잘못된 요청입니다.',
          },
        });
        return;
      }
      const msgResolver = {
        EXPIRED_CODE: '인증토큰이 만료되었습니다.',
        DISABLED_CODE: '이미 처리되었거나 비활성화된 인증토큰입니다.',
      };
      const message = msgResolver[e.response.data.name] || '잘못된 요청입니다.';
      this.setState({
        error: {
          code: e.response.status,
          message,
        },
      });
    }
  };

  componentDidMount() {
    this.initialize();
  }

  render() {
    const { processed, error } = this.state;
    if (error) return <ErrorInfo {...error} />;
    if (processed) return <SuccessInfo message="이메일 인증이 완료되었습니다" />;
    return null;
  }
}

export default EmailCertifyContainer;
