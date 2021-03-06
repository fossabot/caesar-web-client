import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from '@caesar/common/utils/formikUtils';
import { ITEM_WORKFLOW_EDIT_MODE, TRASH_TYPE } from '@caesar/common/constants';
import {
  Uploader,
  Input,
  Button,
  Select,
  TextArea,
  File,
} from '@caesar/components';
import { upperFirst } from '@caesar/common/utils/string';
import { Form } from '../components';
import { schema } from './schema';

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(Button)`
  margin-right: 20px;
  text-transform: uppercase;
`;

const SubmitButton = styled(Button)`
  text-transform: uppercase;
`;

const TitleInput = styled(Input)`
  margin-top: 5px;
  margin-bottom: 65px;

  ${Input.InputField} {
    padding: 0;
    font-size: 36px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.black};

    &::placeholder {
      padding-left: 8px;
      color: ${({ theme }) => theme.lightGray};
    }

    &:focus {
      background-color: ${({ theme }) => theme.white};
    }
  }
`;

const AdditionalLabel = styled.div`
  position: absolute;
  top: -20px;
  left: 15px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

const Attachment = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 25px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const FileRow = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Error = styled.div`
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const ErrorStyled = styled(Error)`
  margin: 20px 0;
`;

const createInitialValues = (data, listId, type) => ({
  ...data,
  listId,
  type,
});

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (attachments = [], errors = [], setFieldValue) =>
  attachments.map((attachment, index) => (
    <FileRow key={index}>
      <File
        isClosable
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

const DocumentForm = ({
  item: { data, listId, type },
  mode,
  onFinishCreateWorkflow,
  onFinishEditWorkflow,
  onCancelWorkflow,
}) => {
  const isEditMode = mode === ITEM_WORKFLOW_EDIT_MODE;

  const action = isEditMode ? onFinishEditWorkflow : onFinishCreateWorkflow;

  const buttonText = isEditMode ? 'Update' : 'Add';

  return (
    <Formik
      key="documentForm"
      initialValues={createInitialValues(data, listId, type)}
      onSubmit={action}
      isInitialValid={schema.isValidSync(
        createInitialValues(data, listId, type),
      )}
      validationSchema={schema}
      render={({
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        isValid,
      }) => (
        <Form onSubmit={handleSubmit}>
          <ButtonWrapper>
            <CancelButton color="white" onClick={onCancelWorkflow}>
              Cancel
            </CancelButton>
            <SubmitButton htmlType="submit" disabled={isSubmitting || !isValid}>
              {buttonText}
            </SubmitButton>
          </ButtonWrapper>
          <FastField name="name">
            {({ field }) => (
              <TitleInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Enter the title"
                autoFocus
                error={checkError(touched, errors, 'name')}
              />
            )}
          </FastField>
          <Row>
            <AdditionalLabel>Notes</AdditionalLabel>
            <FastField name="note">
              {({ field }) => <TextArea {...field} />}
            </FastField>
          </Row>
          <AttachmentsSection>
            <Attachment>Attachments</Attachment>
            <Uploader
              name="attachments"
              files={values.attachments}
              multiple
              onChange={setFieldValue}
            />
            {errors &&
              errors.attachments &&
              typeof errors.attachments === 'string' && (
                <ErrorStyled>{errors.attachments}</ErrorStyled>
              )}
            <Attachments>
              {renderAttachments(
                values.attachments,
                errors.attachments,
                setFieldValue,
              )}
            </Attachments>
          </AttachmentsSection>
        </Form>
      )}
    />
  );
};

export default DocumentForm;
