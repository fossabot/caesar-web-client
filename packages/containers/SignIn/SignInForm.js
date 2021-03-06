import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Input, PasswordInput, Button, Icon, Link } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { schema } from './schema';

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledEmailInput = styled(Input)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.lightGray};

  ${Input.InputField} {
    line-height: 20px;
  }

  ${Input.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
  }
`;

const StyledPasswordInput = styled(PasswordInput)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.lightGray};

  ${PasswordInput.InputField} {
    line-height: 20px;
  }

  ${PasswordInput.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
  }
`;

const Prefix = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${({ theme }) => theme.lightGray};
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 60px;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
`;

const EmailInputPrefix = (
  <Prefix>
    <Icon name="email" width={18} height={18} />
  </Prefix>
);

const PasswordInputPrefix = (
  <Prefix>
    <Icon name="key-diagonal" width={18} height={18} />
  </Prefix>
);

const SignInForm = ({ onSubmit }) => (
  <Formik
    key="documentForm"
    onSubmit={onSubmit}
    initialValues={{ email: '', password: '' }}
    validationSchema={schema}
    render={({
      errors,
      touched,
      handleSubmit,
      setFieldTouched,
      isSubmitting,
      isValid,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Row>
          <FastField
            name="email"
            render={({ field }) => (
              <StyledEmailInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Email"
                prefix={EmailInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'email') && (
            <Error>{errors.email}</Error>
          )}
        </Row>
        <Row>
          <FastField
            name="password"
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Password"
                prefix={PasswordInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'password') && (
            <Error>{errors.password}</Error>
          )}
        </Row>
        <ButtonWrapper>
          {/* <StyledLink>Forgot password?</StyledLink> */}
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Login
          </StyledButton>
        </ButtonWrapper>
      </Form>
    )}
  />
);

export default SignInForm;
