import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import DownloadIcon from '@caesar/assets/icons/svg/icon-download-white.svg';

const FileExt = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 14px;
  letter-spacing: 0.4px;
  background-color: ${({ theme }) => theme.gray};
  color: ${({ theme }) => theme.white};
  border-radius: 3px 0 3px 3px;
  cursor: pointer;
  transition: all 0.2s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    background: ${({ theme }) => theme.alto};
    display: block;
    width: 0;
    border-style: solid;
    border-width: 4px;
    border-color: ${({ theme }) =>
      `${theme.white} ${theme.white} transparent transparent`};
    border-radius: 0 0 0 3px;
  }
`;

const ErrorStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${({ theme }) => theme.red};
  border-radius: 50%;
  width: 40px;
  height: 40px;

  &:after {
    content: '!';
    position: absolute;
    color: ${({ theme }) => theme.red};
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const FileName = styled.div`
  font-size: 18px;
  line-height: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 8px;
`;

const FileSize = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const UploadedWrapper = styled.div`
  display: flex;

  &:hover {
    ${FileExt} {
      background: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.white};
      font-size: 0;
      background: url(${DownloadIcon}) no-repeat center
        ${({ theme }) => theme.black};

      &:before {
        background: ${({ theme }) => theme.black};
      }
    }
  }
`;

const ErrorWrapper = styled.div`
  display: flex;
`;

const StyledCloseIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
  margin-left: 10px;
  cursor: pointer;
`;

const units = ['bytes', 'KB', 'MB'];

const formatBytes = x => {
  let l = 0;
  let n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) n /= 1024;

  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
};

const UPLOADED_STATUS = 'uploaded';
const ERROR_STATUS = 'error';

const File = ({
  status = UPLOADED_STATUS,
  name,
  raw,
  onClickRemove,
  onClickDownload,
  ...props
}) => {
  const ext = name.split('.').pop();
  const filename = name.replace(/\.[^/.]+$/, '');
  const size = formatBytes(Math.round((raw.length * 3) / 4));

  if (status === ERROR_STATUS) {
    return (
      <ErrorWrapper>
        <ErrorStatus />
        <Details>
          <FileName>{filename}</FileName>
          <FileSize>{size}</FileSize>
        </Details>
        <StyledCloseIcon
          name="close"
          width={10}
          height={10}
          onClick={onClickRemove}
        />
      </ErrorWrapper>
    );
  }

  return (
    <UploadedWrapper {...props}>
      <FileExt onClick={onClickDownload}>{ext}</FileExt>
      <Details>
        <FileName>{filename}</FileName>
        <FileSize>{size}</FileSize>
      </Details>
      {onClickRemove && (
        <StyledCloseIcon
          name="close"
          width={10}
          height={10}
          onClick={onClickRemove}
        />
      )}
    </UploadedWrapper>
  );
};

File.FileName = FileName;
File.FileExt = FileExt;

export default File;
