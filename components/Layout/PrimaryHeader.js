import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { SearchInput } from '../Input';
import { Logo } from './Logo';

const Wrapper = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  max-height: 70px;
  min-height: 70px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  flex-shrink: 0;
  padding-left: 60px;
  ${({ withBorder, theme }) =>
    withBorder && `border-right: 1px solid ${theme.gallery}`};
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 30px;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`;

const UserName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-left: 15px;
  margin-right: 15px;
`;

const StyledDropdown = styled(Dropdown)`
  display: flex;
  color: ${({ theme }) => theme.black};
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};
  }
`;

const Option = styled.div`
  padding: 10px 30px;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const Anchor = styled.a`
  color: ${({ theme }) => theme.black};
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.gray};
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
`;

const Options = (
  <Fragment>
    <Option key="settings">
      <Link href="/settings">
        <Anchor>Settings</Anchor>
      </Link>
    </Option>
    <Option key="logout">
      <Link href="/logout">
        <Anchor>Logout</Anchor>
      </Link>
    </Option>
  </Fragment>
);

export class PrimaryHeader extends PureComponent {
  state = {
    isDropdownOpened: false,
  };

  toggleDropdown = isDropdownOpened => {
    this.setState({
      isDropdownOpened,
    });
  };

  render() {
    const {
      user,
      withSearch = false,
      searchedText,
      onSearch,
      onClickReset,
    } = this.props;
    const { isDropdownOpened } = this.state;

    return (
      <Wrapper>
        <LeftWrapper withBorder={withSearch}>
          <Logo />
        </LeftWrapper>
        {!!user && (
          <RightWrapper>
            <SearchInput
              searchedText={searchedText}
              onChange={onSearch}
              onClickReset={onClickReset}
            />
            <UserSection>
              <Avatar {...user} name={user.email} />
              <StyledDropdown overlay={Options} onToggle={this.toggleDropdown}>
                <UserName>{user.email}</UserName>
                <StyledIcon
                  name={
                    isDropdownOpened ? 'arrow-up-small' : 'arrow-down-small'
                  }
                  width={10}
                  height={16}
                />
              </StyledDropdown>
            </UserSection>
          </RightWrapper>
        )}
      </Wrapper>
    );
  }
}