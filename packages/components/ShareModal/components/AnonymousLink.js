import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Toggle } from '../../Toggle';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { hideLink, getAnonymousLink } from '../utils';

const spin = keyframes`
  0% {transform:rotate(0deg)}
  100% {transform:rotate(360deg)}
`;

const AnonymousLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.snow};
  padding: 10px 20px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ isActive, theme }) => (isActive ? theme.black : theme.gray)};
  margin-left: 20px;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const LinkWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-radius: 3px;
  border: solid 1px ${({ theme }) => theme.gallery};
  background-color: ${({ theme }) => theme.white};
  padding: 10px 20px;
  width: 100%;
`;

const LinkText = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.emperor};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 300px;
`;

const UpdateIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  fill: ${({ theme }) => theme.emperor};

  &:hover {
    fill: ${({ disabled, theme }) => (disabled ? theme.emperor : theme.black)};
  }
`;

const UpdateIconLoading = styled(UpdateIcon)`
  animation-name: ${spin};
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const AnonymousLink = ({ link, isLoading, onToggle, onCopy, onUpdate }) => {
  const isLinkActive = !!link;
  const linkText = isLinkActive ? hideLink(getAnonymousLink(link)) : '';

  const isToggleLoading = !isLinkActive && isLoading;

  const UpdateIconComponent = isLoading ? UpdateIconLoading : UpdateIcon;

  return (
    <AnonymousLinkWrapper>
      <ToggleWrapper>
        <Toggle
          checked={isLinkActive}
          value={isLinkActive}
          isLoading={isToggleLoading}
          onChange={onToggle}
        />
        <ToggleLabel isActive={isLinkActive}>
          Share via a anonymous link:
        </ToggleLabel>
      </ToggleWrapper>
      {isLinkActive && (
        <BottomWrapper>
          <LinkWrapper>
            <LinkText>{linkText}</LinkText>
            <UpdateIconComponent
              name="update"
              disabled={isLoading}
              onClick={onUpdate}
            />
          </LinkWrapper>
          <Button
            color="black"
            icon="copy"
            disabled={isLoading}
            onClick={onCopy}
          >
            COPY
          </Button>
        </BottomWrapper>
      )}
    </AnonymousLinkWrapper>
  );
};

export default AnonymousLink;
