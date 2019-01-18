import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Row = styled.div`
  display: flex;
  padding: 15px 30px 20px;
  background: ${({ theme, isActive }) =>
    isActive ? theme.white : theme.lightBlue};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.gallery};
  }
`;

const ItemType = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.gray};
  border-radius: 3px;
  margin-right: 20px;
  width: 40px;
  min-width: 40px;
  height: 40px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  line-height: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 8px;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBox = styled(Box)`
  margin-left: 20px;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
  margin-right: 5px;
`;

const Item = ({
  id,
  lastUpdated,
  secret: { name, attachments },
  shared,
  isActive = false,
  onClickItem = Function.prototype,
}) => {
  const shouldShowMembers = shared.length > 0;
  const shouldShowAttachments = attachments && attachments.length > 0;

  return (
    <Row key={id} onClick={onClickItem(id)} isActive={isActive}>
      <ItemType>
        <Icon name="key" width={20} height={20} fill="#fff" />
      </ItemType>
      <Details>
        <Title>{name}</Title>
        <Box>
          <Text>{lastUpdated}</Text>
          <Box>
            {shouldShowAttachments && (
              <Box>
                <StyledIcon name="clip" width={16} height={16} />
                <Text>{attachments.length}</Text>
              </Box>
            )}
            {shouldShowMembers && (
              <StyledBox>
                <StyledIcon name="group" width={16} height={16} />
                <Text>{shared.length}</Text>
              </StyledBox>
            )}
          </Box>
        </Box>
      </Details>
    </Row>
  );
};

export default Item;