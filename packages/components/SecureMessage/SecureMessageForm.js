import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { media } from '@caesar/assets/styles/media';
import {
  Checkbox,
  TextArea,
  Uploader,
  PasswordInput,
  File,
  Button,
  withNotification,
  withOfflineDetection,
} from '@caesar/components';
import { Select } from '@caesar/components/Select';
import { checkError } from '@caesar/common/utils/formikUtils';
import {
  initialValues,
  requestsLimitOptions,
  secondsLimitOptions,
} from './constants';
import { schema } from './schema';

const Form = styled.form`
  width: 100%;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ColumnStyled = styled(Column)`
  margin-left: 20px;

  ${media.wideMobile`
    margin-top: 20px;
    margin-left: 0;
  `}
`;

const Label = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const InputStyled = styled(PasswordInput)`
  border-radius: 3px;
  border: solid 1px ${({ theme }) => theme.gallery};
`;

const TextAreaStyled = styled(TextArea)`
  ${TextArea.TextAreaField} {
    background: ${({ theme }) => theme.white};
  }
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 20px 0;
`;

const SelectRow = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;

  ${media.wideMobile`
    flex-wrap: wrap;
  `}
`;

const StyledSelect = styled(Select)`
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  padding: 18px 20px;
  height: 60px;

  ${Select.ValueText} {
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.6px;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  margin: 30px 0;
`;

const StyledButton = styled(Button)`
  position: relative;
`;

const ButtonImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 279px;
  height: 200px;
  transform: translate(-110px, -70px);
`;

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (attachments = [], errors = [], setFieldValue) =>
  attachments.map((attachment, index) => (
    <FileRow key={index}>
      <File
        key={index}
        status={checkAttachmentsError(errors, index) ? 'error' : 'uploaded'}
        onClickRemove={() =>
          setFieldValue(
            'attachments',
            attachments.filter((_, fileIndex) => index !== fileIndex),
          )
        }
        {...attachment}
      />
      {checkAttachmentsError(errors, index) && (
        <Error>{errors[index].raw}</Error>
      )}
    </FileRow>
  ));

class SecureMessageForm extends Component {
  state = {
    isCustomPassword: false,
  };

  handleChange = () => {
    this.setState(prevState => ({
      isCustomPassword: !prevState.isCustomPassword,
    }));
  };

  render() {
    const { onSubmit, notification, isOnline } = this.props;
    const { isCustomPassword } = this.state;

    return (
      <Formik
        key="secureMessageForm"
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Label>Text or image to encrypt and expire</Label>
              <FastField name="text">
                {({ field }) => (
                  <TextAreaStyled
                    {...field}
                    placeholder="Divide et Impera"
                    onBlur={setFieldTouched}
                    error={checkError(touched, errors, 'text')}
                  />
                )}
              </FastField>
            </Row>
            <AttachmentsSection>
              <Uploader
                multiple
                asPreview
                name="attachments"
                files={values.attachments}
                notification={notification}
                onChange={setFieldValue}
              />
              <Attachments>
                {renderAttachments(
                  values.attachments,
                  errors.attachments,
                  setFieldValue,
                )}
              </Attachments>
            </AttachmentsSection>
            <SelectRow>
              <Column>
                <Label>Data expires in</Label>
                <StyledSelect
                  boxOffset={60}
                  name="secondsLimit"
                  placeholder="Select option"
                  value={values.secondsLimit}
                  options={secondsLimitOptions}
                  onChange={setFieldValue}
                />
              </Column>
              <ColumnStyled>
                <Label>Number of Attempts</Label>
                <StyledSelect
                  boxOffset={60}
                  name="requestsLimit"
                  placeholder="Select option"
                  value={values.requestsLimit}
                  options={requestsLimitOptions}
                  onChange={setFieldValue}
                />
              </ColumnStyled>
            </SelectRow>
            <Row>
              <Checkbox
                checked={isCustomPassword}
                value={isCustomPassword}
                onChange={this.handleChange}
              >
                Create my own password for access to encrypted data
              </Checkbox>
            </Row>
            {isCustomPassword && (
              <Row>
                <Label>Password</Label>
                <FastField name="password">
                  {({ field }) => (
                    <InputStyled {...field} onBlur={setFieldTouched} />
                  )}
                </FastField>
                {checkError(touched, errors, 'password') && (
                  <Error>{checkError(touched, errors, 'password')}</Error>
                )}
              </Row>
            )}
            <ButtonWrapper>
              <ButtonImg
                srcSet="/images/secure-bg-btn@2x.png 2x, /images/secure-bg-btn@3x.png 3x"
                src="/images/secure-bg-btn.png"
              />
              <StyledButton
                htmlType="submit"
                isHigh
                disabled={isSubmitting || !(isValid && dirty) || !isOnline}
              >
                Create Secure Message
              </StyledButton>
            </ButtonWrapper>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withOfflineDetection(withNotification(SecureMessageForm));
