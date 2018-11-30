// @flow
import React, { Component, Fragment } from 'react';
import type { EmailInfoData } from 'store/modules/settings';
import WarningIcon from 'react-icons/lib/md/warning';
import Toggler from 'components/common/Toggler';
import cx from 'classnames';
import './SettingEmail.scss';

type Props = {
  emailInfo: EmailInfoData,
  onSaveEmailPermissions: () => Promise<any>,
  onChangeEmail: (email: string) => Promise<any>,
  onResendCertmail: () => Promise<any>,
  onUpdateEmailPermission: (payload: { name: string, value: boolean }) => void,
};

type State = {
  edit: boolean,
  email: string,
  status: 'idle' | 'success' | 'error',
};

class SettingEmail extends Component<Props, State> {
  state = {
    edit: false,
    email: '',
    status: 'idle',
  };

  onStartEditing = () => {
    this.setState({
      edit: true,
    });
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value,
    });
  };

  onConfirm = async () => {
    const { email } = this.state;
    try {
      await this.props.onChangeEmail(email);
      this.setState({
        status: 'success',
      });
    } catch (e) {
      this.setState({
        status: 'error',
      });
      // handle error
      console.log(e);
    }
    this.setState({
      edit: false,
    });
  };

  onCancel = () => {
    this.setState({
      edit: false,
      email: '',
    });
  };

  onChangeToggler = (event: { name: string, value: boolean }) => {
    this.props.onUpdateEmailPermission(event);
  };

  render() {
    const { emailInfo, onSaveEmailPermissions } = this.props;
    const { edit, email } = this.state;
    return (
      <div className="SettingEmail">
        {edit ? (
          <div className="edit-email">
            <div className="email-form">
              <input value={email} onChange={this.onChange} />
              <button className="confirm" onClick={this.onConfirm}>
                변경
              </button>
              <button className="cancel" onClick={this.onCancel}>
                취소
              </button>
            </div>
            <div className="caution">
              이메일 변경을 하시면 이전 이메일로 다시 로그인 할 수 없습니다.
            </div>
          </div>
        ) : (
          <Fragment>
            {!emailInfo.is_certified &&
              emailInfo.email && (
                <div className="need-certify">
                  <span>
                    {this.state.status === 'success'
                      ? '인증 메일이 발송되었습니다. 메일을 확인해주세요.'
                      : '인증되지 않은 이메일입니다.'}
                  </span>
                  <button onClick={this.props.onResendCertmail}>인증 메일 재발송</button>
                </div>
              )}
            <div className="current-email">
              <div className={cx('email', { empty: !emailInfo.email })}>
                {!emailInfo.email && <WarningIcon />}
                {emailInfo.email || '이메일이 존재하지 않습니다.'}
                <button className="email-action" onClick={this.onStartEditing}>
                  {emailInfo.email ? '변경' : '등록'}
                </button>
              </div>
            </div>
          </Fragment>
        )}
        {!edit &&
          emailInfo.is_certified && (
            <section>
              <h5>이메일 수신 설정</h5>
              <div className="togglers">
                <Toggler
                  name="email_notification"
                  text="댓글 알림"
                  value={emailInfo.permissions.email_notification}
                  onChange={this.onChangeToggler}
                />
                <Toggler
                  name="email_promotion"
                  text="이벤트 및 프로모션"
                  value={emailInfo.permissions.email_promotion}
                  onChange={this.onChangeToggler}
                />
              </div>
              <button onClick={onSaveEmailPermissions}>이메일 수신 설정 저장</button>
            </section>
          )}
      </div>
    );
  }
}

export default SettingEmail;
