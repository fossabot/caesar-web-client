import React from 'react';
import { Label } from '@caesar-ui';
import { Wrapper, FieldWrapper, Field, FieldValue, Title } from '../components';

export const Document = props => {
  const {
    item: {
      secret: { name, note },
    },
  } = props;
  const shouldShowNote = !!note;

  return (
    <Wrapper>
      <Title>{name}</Title>
      <FieldWrapper>
        {shouldShowNote && (
          <Field>
            <Label>Note</Label>
            <FieldValue>{note}</FieldValue>
          </Field>
        )}
      </FieldWrapper>
    </Wrapper>
  );
};

export default Document;
