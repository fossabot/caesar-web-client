import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Icon } from '@caesar-ui';

const StyledIcon = styled(Icon)`
  margin: auto auto;
  fill: ${({ theme }) => theme.emperor};
`;

const EmptyItem = () => (
  <Fragment>
    <StyledIcon name="logo" width={142} height={40} />
  </Fragment>
);

export default EmptyItem;
