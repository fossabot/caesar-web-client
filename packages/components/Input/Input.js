import React, { Component } from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  width: 100%;
`;

const LabelText = styled.div`
  position: absolute;
  top: ${({ isFocused, value }) => (isFocused || value ? '-25px' : '5px')};
  left: 15px;
  z-index: 10;
  margin-bottom: ${({ isFocused }) => (isFocused ? '0' : '5px')};
  font-size: ${({ isFocused, value }) =>
    isFocused || value ? '14px' : '18px'};
  line-height: 1.5;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
  transition: all 0.2s;
`;

const InputField = styled.input`
  padding: 18px 20px;
  display: block;
  width: 100%;
  font-size: 18px;
  letter-spacing: 0.6px;
  background-color: ${({ theme, isFocused }) =>
    isFocused ? theme.snow : theme.white};
  border: none;
  border-bottom: ${({ theme, withBorder, isFocused }) =>
    withBorder && !isFocused
      ? `1px solid ${theme.gallery}`
      : '1px solid transparent'};
  outline: none;

  &::placeholder {
    padding: 5px 0;
    color: ${({ theme }) => theme.gray};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
    -webkit-transition-delay: 9999s;
  }
`;

const Prefix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  left: 16px;
`;

const PostFix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  right: 25px;
`;

const Error = styled.div`
  padding-left: 15px;
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

class Input extends Component {
  state = {
    isFocused: false,
  };

  onFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  onBlur = () => {
    const { name, onBlur } = this.props;

    this.setState(
      {
        isFocused: false,
      },
      () => onBlur && onBlur(name, true),
    );
  };

  render() {
    const { isFocused } = this.state;
    const {
      children,
      label,
      className,
      error,
      value,
      prefix,
      postfix,
      withBorder,
      ...props
    } = this.props;

    const isError = !!error;

    return (
      <Label className={className}>
        {label && (
          <LabelText isFocused={isFocused} value={value}>
            {label}
          </LabelText>
        )}
        {prefix && <Prefix>{prefix}</Prefix>}
        <InputField
          {...props}
          autoComplete="off"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          isFocused={isFocused}
          withBorder={withBorder}
          isError={isError}
          value={value}
        />
        {postfix && <PostFix>{postfix}</PostFix>}
        {error && <Error>{error}</Error>}
      </Label>
    );
  }
}

Input.InputField = InputField;
Input.Prefix = Prefix;
Input.PostFix = PostFix;

export default Input;
