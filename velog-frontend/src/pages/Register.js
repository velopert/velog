// @flow
import React from 'react';
import RegisterTemplate from 'components/templates/RegisterTemplate';
import RegisterFormContainer from 'containers/register/RegisterFormContainer';

const Register = () => {
  return (
    <RegisterTemplate
      form={<RegisterFormContainer />}
    />
  );
};

export default Register;
