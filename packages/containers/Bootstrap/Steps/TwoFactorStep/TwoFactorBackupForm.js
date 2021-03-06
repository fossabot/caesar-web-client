import React from 'react';
import styled from 'styled-components';
import { FastField, Formik } from 'formik';
import copy from 'copy-text-to-clipboard';
import { formatNumbersByColumns } from '@caesar/common/utils/format';
import { Button, Checkbox, AuthTitle } from '@caesar/components';
import { downloadTextData } from '@caesar/common/utils/download';
import { printData } from '@caesar/common/utils/print';
import { backupInitialValues } from './constants';
import { agreeSchema } from './schema';

const Wrapper = styled.div`
  max-width: 530px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  text-align: center;
  color: ${({ theme }) => theme.gray};
`;

const Codes = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.lightBlue};
  border-radius: 4px;
  margin: 50px 0 30px;
`;

const Code = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  line-height: 25px;
  padding: 20px 25px;
  flex: 0 0 25%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  ${Checkbox.Text} {
    font-size: 18px;
    letter-spacing: 0.6px;
  }
`;

const NextButton = styled(Button)`
  height: 60px;
  font-size: 18px;
  margin-top: 30px;
`;

const TwoFactorBackupForm = ({ codes, onSubmit }) => (
  <Wrapper>
    <Formik
      key="backupCodes"
      initialValues={backupInitialValues}
      validationSchema={agreeSchema}
      onSubmit={onSubmit}
      render={({ handleSubmit, isSubmitting, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <AuthTitle>Save your backup codes</AuthTitle>
          <Description>
            Backup codes let you access your account if lost your phone. Keep
            these codes somewhere safe but accessible.
          </Description>
          <Codes id="codes">
            {codes.map((code, index) => (
              <Code key={index}>{code}</Code>
            ))}
          </Codes>
          <ButtonsWrapper>
            <StyledButton
              color="white"
              icon="copy"
              onClick={() => copy(formatNumbersByColumns(codes, 4))}
            >
              COPY
            </StyledButton>
            <StyledButton
              color="white"
              icon="download"
              onClick={() => downloadTextData(formatNumbersByColumns(codes, 4))}
            >
              DOWNLOAD
            </StyledButton>
            <StyledButton
              color="white"
              icon="print"
              onClick={() => printData(formatNumbersByColumns(codes, 4))}
            >
              PRINT
            </StyledButton>
          </ButtonsWrapper>
          <FastField
            name="agreeCheck"
            render={({ field }) => (
              <StyledCheckbox {...field} checked={field.value}>
                I have printed or saved these codes
              </StyledCheckbox>
            )}
          />
          <NextButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Continue
          </NextButton>
        </Form>
      )}
    />
  </Wrapper>
);

export default TwoFactorBackupForm;
