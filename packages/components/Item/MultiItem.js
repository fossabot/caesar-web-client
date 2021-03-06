import React from 'react';
import styled from 'styled-components';
import { Button } from '@caesar/components';
import { Checkbox } from '../Checkbox';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.white};
  position: relative;
  height: 61px;
  padding: 0 20px;
`;

const LeftTopWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const RightTopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonStyled = styled(Button)`
  margin-right: 10px;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 20px;

  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.emperor};
    border: 1px solid ${({ theme }) => theme.emperor};

    ${({ checked }) => `

      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }
`;

const MultiItem = ({
  // TODO: remove this check here
  isInboxList = false,
  //
  isTrashItems = false,
  areAllItemsSelected = false,
  workInProgressItemIds,
  onClickMove = Function.prototype,
  onClickRemove = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickShare = Function.prototype,
  onSelectAll = Function.prototype,
}) => {
  if (!workInProgressItemIds) {
    return null;
  }

  return (
    <Wrapper>
      <LeftTopWrapper>
        <CheckboxStyled checked={areAllItemsSelected} onChange={onSelectAll} />
        {workInProgressItemIds.length} items
      </LeftTopWrapper>
      <RightTopWrapper>
        <ButtonStyled withOfflineCheck color="white" onClick={onClickMove}>
          MOVE
        </ButtonStyled>
        {!isInboxList && (
          <ButtonStyled
            onlyIcon
            withOfflineCheck
            color="white"
            icon="share"
            onClick={onClickShare}
          />
        )}
        <Button
          onlyIcon
          withOfflineCheck
          color="white"
          icon="trash"
          onClick={isTrashItems ? onClickRemove : onClickMoveToTrash}
        />
      </RightTopWrapper>
    </Wrapper>
  );
};

export default MultiItem;
